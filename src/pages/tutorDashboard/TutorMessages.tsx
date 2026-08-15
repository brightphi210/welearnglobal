import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FiArrowLeft, FiLoader, FiRefreshCw, FiSearch, FiSend, FiSmile } from "react-icons/fi";
import { useLocation } from "react-router-dom";
import { useGetChats, useGetSingleChat } from "../../hooks/queries/allQueries";

const TOP_NAV_HEIGHT = 120;
const DESKTOP_NAV_HEIGHT = 20;
const MOBILE_BOTTOM_NAV_HEIGHT = 10;

const WS_BASE_URL = "wss://api.welearnglobal.online";
const getAccessToken = () => localStorage.getItem("welearnToken") || "";

const CURRENT_USER_ROLE = "tutor" as const;
const OTHER_PARTICIPANT_ROLE = "student" as const;

const MAX_MESSAGE_LENGTH = 2000;
const MAX_RECONNECT_DELAY_MS = 15000;
const HEARTBEAT_INTERVAL_MS = 25000;
const MAX_AUTH_RETRIES = 2;

const CHAT_BG_PATTERN =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Cg fill='none' stroke='%23000000' stroke-opacity='0.045' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3C!-- chat bubble --%3E%3Cpath d='M20 30 h22 a6 6 0 0 1 6 6 v12 a6 6 0 0 1 -6 6 h-14 l-6 6 v-6 h-2 a6 6 0 0 1 -6 -6 v-12 a6 6 0 0 1 6 -6 z'/%3E%3C!-- music note --%3E%3Cpath d='M95 20 v20 a5 5 0 1 1 -3 -4.6 V22 l14 -4 v16 a5 5 0 1 1 -3 -4.6 V16 z'/%3E%3C!-- heart --%3E%3Cpath d='M150 35 c-4 -8 -16 -6 -16 3 c0 7 9 12 16 18 c7 -6 16 -11 16 -18 c0 -9 -12 -11 -16 -3 z'/%3E%3C!-- camera --%3E%3Cpath d='M20 95 h26 v18 h-26 z M28 95 l3 -5 h8 l3 5 M33 104 a4 4 0 1 0 0.1 0'/%3E%3C!-- leaf/plant --%3E%3Cpath d='M95 90 c10 -2 18 6 16 16 c-10 2 -18 -6 -16 -16 z M95 90 c2 6 2 12 0 20'/%3E%3C!-- paper plane --%3E%3Cpath d='M145 88 l28 12 l-12 4 l-4 12 l-4 -10 z'/%3E%3C!-- clock --%3E%3Ccircle cx='30' cy='155' r='11'/%3E%3Cpath d='M30 148 v7 l5 4'/%3E%3C!-- mic --%3E%3Cpath d='M100 145 a6 6 0 0 1 12 0 v8 a6 6 0 0 1 -12 0 z M94 155 a12 12 0 0 0 24 0 M106 167 v6 M100 173 h12'/%3E%3C!-- star --%3E%3Cpath d='M165 150 l3 7 l7.5 1 l-5.5 5.3 l1.3 7.5 l-6.3 -3.7 l-6.3 3.7 l1.3 -7.5 l-5.5 -5.3 l7.5 -1 z'/%3E%3C!-- small dots scattered for texture --%3E%3Ccircle cx='60' cy='60' r='1.4'/%3E%3Ccircle cx='175' cy='65' r='1.4'/%3E%3Ccircle cx='65' cy='130' r='1.4'/%3E%3Ccircle cx='135' cy='140' r='1.4'/%3E%3Ccircle cx='10' cy='175' r='1.4'/%3E%3C/g%3E%3C/svg%3E";
const EMOJI_LIST = [
  "😀", "😁", "😂", "🤣", "😊", "🙂", "😉", "😍",
  "😘", "😜", "🤔", "😎", "😴", "😢", "😭", "😡",
  "👍", "👎", "👏", "🙏", "🔥", "🎉", "❤️", "💯",
  "✅", "🙌", "😅", "😇", "🥳", "🤗", "😬", "👋",
];

interface ChatUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  role: "student" | "tutor" | string;
  profile_image: string | null;
  is_active: boolean;
  date_joined: string;
}

interface ChatMessage {
  id: number;
  thread: number;
  sender: ChatUser;
  receiver: ChatUser | null;
  content: string;
  created_at: string;
  read_at?: string | null;
}

interface ChatThread {
  id: number;
  student: number;
  tutor: number;
  created_at: string;
  other_participant_name: string;
  // The API returns the full last message object (or null), not a string.
  last_message: ChatMessage | null;
  unread_count: number;
}

type SocketStatus = "idle" | "connecting" | "open" | "error";

const formatMessageTime = (iso: string) => {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
};

const initialsFor = (name: string) =>
  name
    ?.trim()
    .split(/\s+/)
    .map((n) => n[0])
    .filter(Boolean)
    .join("")
    .slice(0, 2)
    .toUpperCase() || "?";


const getOtherParticipant = (chat: ChatThread): { name: string; profileImage: string | null; role: string } => {
  const lastMessage = chat.last_message;
  const candidate =
    lastMessage?.sender?.role === OTHER_PARTICIPANT_ROLE
      ? lastMessage.sender
      : lastMessage?.receiver?.role === OTHER_PARTICIPANT_ROLE
        ? lastMessage.receiver
        : null;

  return {
    name: candidate?.full_name || chat.other_participant_name || "Unknown",
    profileImage: candidate?.profile_image ?? null,
    role: candidate?.role || OTHER_PARTICIPANT_ROLE,
  };
};

const TutorMessages = () => {
  const location = useLocation() as { state?: { chatId?: number } };
  const queryClient = useQueryClient();


  const [selectedChat, setSelectedChat] = useState<any>(location.state?.chatId ?? null);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [liveMessages, setLiveMessages] = useState<ChatMessage[]>([]);
  const [socketStatus, setSocketStatus] = useState<SocketStatus>("idle");
  const socketRef = useRef<WebSocket | null>(null);
  const [reconnectNonce, setReconnectNonce] = useState(0);

  const { getChats, isLoading: isLoadingChats } = useGetChats();
  const chats: ChatThread[] = Array.isArray(getChats?.data?.results)
    ? getChats.data?.results
    : Array.isArray(getChats)
      ? getChats
      : [];

  const chatId = selectedChat != null ? String(selectedChat) : undefined;
  const { getSingleChat, isFetching: isLoadingMessages, refetch: refetchMessages } =
    useGetSingleChat(chatId);

  const raw = getSingleChat?.data;
  const messageHistory: ChatMessage[] = Array.isArray(raw?.results)
    ? raw.results
    : Array.isArray(raw)
      ? raw
      : Array.isArray(raw?.messages)
        ? raw.messages
        : [];

  const filteredChats = useMemo(() => {
    if (!searchQuery.trim()) return chats;
    const q = searchQuery.toLowerCase();
    return chats.filter((c) => c.other_participant_name?.toLowerCase().includes(q));
  }, [chats, searchQuery]);

  // Nothing is "selected" until the user actually clicks a thread — on both
  // mobile AND desktop. No more auto-opening the first chat in the list.
  const currentChat = chats.find((c) => c.id === selectedChat);

  const messages = useMemo(() => {
    if (selectedChat == null) return [];
    const byId = new Map<number, ChatMessage>();
    [...messageHistory, ...liveMessages].forEach((m) => {
      if (m?.id != null && m.thread === selectedChat) byId.set(m.id, m);
    });
    return Array.from(byId.values()).sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
  }, [messageHistory, liveMessages, selectedChat]);

  useEffect(() => {
    setLiveMessages([]);

    if (selectedChat != null) {
      refetchMessages();
    }

    let cancelled = false;
    let reconnectAttempts = 0;
    let authRetries = 0;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let heartbeatTimer: ReturnType<typeof setInterval> | null = null;

    const clearHeartbeat = () => {
      if (heartbeatTimer) {
        clearInterval(heartbeatTimer);
        heartbeatTimer = null;
      }
    };

    const scheduleReconnect = () => {
      if (cancelled) return;
      setSocketStatus("connecting");
      const delay = Math.min(1000 * 2 ** reconnectAttempts, MAX_RECONNECT_DELAY_MS);
      reconnectAttempts += 1;
      reconnectTimer = setTimeout(connect, delay);
    };

    const connect = () => {
      if (cancelled) return;

      const token = getAccessToken();
      if (!token) {
        setSocketStatus("error");
        console.warn("Chat socket: no access token found, aborting connection");
        return;
      }

      setSocketStatus("connecting");
      const socket = new WebSocket(`${WS_BASE_URL}/ws/chat/${selectedChat}/?token=${encodeURIComponent(token)}`);
      socketRef.current = socket;

      socket.onopen = () => {
        if (cancelled) return;
        reconnectAttempts = 0;
        authRetries = 0;
        setSocketStatus("open");

        clearHeartbeat();
        heartbeatTimer = setInterval(() => {
          if (socket.readyState === WebSocket.OPEN) {
            try {
              socket.send(JSON.stringify({ type: "ping" }));
            } catch {
              // Ignore — if the send genuinely fails the socket is dead and
              // onclose/onerror will fire and trigger a reconnect anyway.
            }
          }
        }, HEARTBEAT_INTERVAL_MS);
      };

      socket.onmessage = (event) => {
        if (cancelled) return;
        try {
          const incoming: ChatMessage = JSON.parse(event.data);
          if (incoming?.id == null) return; // e.g. a pong/ack with no message id
          setLiveMessages((prev) => (prev.some((m) => m.id === incoming.id) ? prev : [...prev, incoming]));

          // Keep the sidebar (last message + unread count) in sync without
          // requiring a manual refresh or leaving/returning to the page.
          queryClient.invalidateQueries({ queryKey: ["chats"] });
        } catch (err) {
          console.error("Failed to parse chat socket message:", err);
        }
      };

      socket.onerror = () => {
        if (!cancelled) setSocketStatus("error");
      };

      socket.onclose = (event) => {
        if (cancelled) return;
        clearHeartbeat();

        if (event.code === 4001) {

          if (authRetries < MAX_AUTH_RETRIES) {
            authRetries += 1;
            scheduleReconnect();
          } else {
            setSocketStatus("error");
            console.warn("Chat socket closed: re-authentication required");
          }
          return;
        }
        if (event.code === 4003) {
          // Not a participant in this thread — retrying can't help.
          setSocketStatus("error");
          console.warn("Chat socket closed: not a participant in this thread");
          return;
        }

        // Any other close (including plain network drops) — keep retrying
        // quietly in the background rather than giving up for good.
        scheduleReconnect();
      };
    };

    connect();

    const tryImmediateReconnect = () => {
      if (cancelled) return;
      const state = socketRef.current?.readyState;
      const isHealthy = state === WebSocket.OPEN || state === WebSocket.CONNECTING;
      if (!isHealthy) {
        if (reconnectTimer) clearTimeout(reconnectTimer);
        connect();
      }
    };
    window.addEventListener("online", tryImmediateReconnect);
    document.addEventListener("visibilitychange", tryImmediateReconnect);

    return () => {
      cancelled = true;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      clearHeartbeat();
      window.removeEventListener("online", tryImmediateReconnect);
      document.removeEventListener("visibilitychange", tryImmediateReconnect);

      const socket = socketRef.current;
      socketRef.current = null;
      if (!socket) return;

      if (socket.readyState === WebSocket.CONNECTING) {
        socket.addEventListener("open", () => socket.close(), { once: true });
      } else {
        socket.close();
      }
    };
  }, [selectedChat, reconnectNonce]);

  const handleReconnect = useCallback(() => {
    setReconnectNonce((n) => n + 1);
  }, []);

  const handleSendMessage = () => {
    const trimmed = messageText.trim().slice(0, MAX_MESSAGE_LENGTH);
    if (!trimmed) return;

    const socket = socketRef.current;
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.warn("Cannot send message: socket is not open");
      return;
    }

    try {
      socket.send(JSON.stringify({ content: trimmed }));
      setMessageText("");
      // Intentionally not appending optimistically — the server echoes
      // the message back over the same socket for both participants.
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  return (
    <div className="md:pl-56 w-full overflow-x-hidden">
      {/* ---------------- DESKTOP LAYOUT ---------------- */}
      <div
        className="hidden md:grid md:grid-cols-4 bg-white"
        style={{ height: `calc(100vh - ${DESKTOP_NAV_HEIGHT}px)` }}
      >
        {/* Chat List */}
        <div className="flex flex-col bg-white pt-14 border-r border-gray-100 h-full overflow-hidden">
          {/* Fixed search header */}
          <div className="px-8 lg:py-6 border-b border-gray-100 shrink-0">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Messages</h2>
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search chats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 bg-gray-50 transition-all"
              />
            </div>
          </div>

          {/* Scrollable chat items */}
          <div className="flex-1 overflow-y-auto">
            {isLoadingChats ? (
              <div className="flex items-center justify-center py-8">
                <FiLoader className="animate-spin text-green-700" size={22} />
              </div>
            ) : filteredChats.length === 0 ? (
              <p className="text-xs text-gray-400 italic text-center py-8">No conversations yet</p>
            ) : (
              filteredChats.map((chat) => (
                <ChatListItem
                  key={chat.id}
                  chat={chat}
                  isActive={selectedChat === chat.id}
                  onSelect={() => setSelectedChat(chat.id)}
                />
              ))
            )}
          </div>
        </div>

        <div className="col-span-3 h-full overflow-hidden">
          <ChatWindow
            currentChat={currentChat}
            messages={messages}
            messageText={messageText}
            setMessageText={setMessageText}
            handleSendMessage={handleSendMessage}
            isLoadingMessages={isLoadingMessages}
            socketStatus={socketStatus}
            onReconnect={handleReconnect}
          />
        </div>
      </div>

      {/* ---------------- MOBILE LAYOUT ---------------- */}
      <div
        className={"md:hidden overflow-x-hidden overflow-y-hidden w-full"}
        style={{ height: `calc(100vh - ${TOP_NAV_HEIGHT}px - ${MOBILE_BOTTOM_NAV_HEIGHT}px)` }}
      >
        {selectedChat !== null ? (
          <ChatWindow
            currentChat={currentChat}
            messages={messages}
            messageText={messageText}
            setMessageText={setMessageText}
            handleSendMessage={handleSendMessage}
            onBack={() => setSelectedChat(null)}
            isLoadingMessages={isLoadingMessages}
            socketStatus={socketStatus}
            onReconnect={handleReconnect}
            isMobile
          />
        ) : (
          <div className="flex flex-col bg-white h-full w-full overflow-hidden lg:pt-14 ">
            <div className="px-4 py-4 border-b border-gray-100 shrink-0">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Messages</h2>
              <div className="flex-1 relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search chats..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 bg-gray-50 transition-all"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {isLoadingChats ? (
                <div className="flex items-center justify-center py-8">
                  <FiLoader className="animate-spin text-green-700" size={22} />
                </div>
              ) : filteredChats.length === 0 ? (
                <p className="text-xs text-gray-400 italic text-center py-8">No conversations yet</p>
              ) : (
                filteredChats.map((chat) => (
                  <ChatListItem
                    key={chat.id}
                    chat={chat}
                    isActive={false}
                    onSelect={() => setSelectedChat(chat.id)}
                    mobile
                  />
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ---------------- Avatar (photo with initials fallback) ----------------
const Avatar = ({
  src,
  name,
  size = 40,
}: {
  src?: string | null;
  name: string;
  size?: number;
}) => {
  const [imgError, setImgError] = useState(false);
  const showImage = Boolean(src) && !imgError;

  return (
    <div
      className="rounded-full shrink-0 overflow-hidden flex items-center justify-center bg-green-950 text-white font-semibold"
      style={{ width: size, height: size, fontSize: Math.max(10, size * 0.35) }}
    >
      {showImage ? (
        <img
          src={src as string}
          alt={name}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        initialsFor(name)
      )}
    </div>
  );
};

// ---------------- Chat list row ----------------
const ChatListItem = ({
  chat,
  isActive,
  onSelect,
  mobile,
}: {
  chat: ChatThread;
  isActive: boolean;
  onSelect: () => void;
  mobile?: boolean;
}) => {
  const other = getOtherParticipant(chat);

  return (
    <button
      onClick={onSelect}
      className={`w-full box-border ${mobile ? "px-4" : "px-8"} py-4 border-b border-gray-50 text-left hover:bg-gray-50 transition-all ${isActive ? "bg-green-50 border-l-4 border-l-green-600" : ""
        }`}
    >
      <div className="flex items-start gap-3">
        <Avatar src={other.profileImage} name={other.name} size={36} />

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1 gap-2">
            <h3 className={`flex-1 min-w-0 font-semibold text-sm text-gray-900 truncate ${chat.unread_count > 0 ? "font-bold" : ""}`}>
              {other.name}
            </h3>
            <span className={`text-xs shrink-0 ${chat.unread_count > 0 ? "text-green-600 font-semibold" : "text-gray-500"}`}>
              {chat.last_message ? formatMessageTime(chat.last_message.created_at) : ""}
            </span>
          </div>
          <p className={`text-xs w-full lg:truncate ${chat.unread_count > 0 ? "text-gray-900 font-medium" : "text-gray-600"}`}>
            {chat.last_message?.content || "No messages yet"}
          </p>
        </div>

        {chat.unread_count > 0 && (
          <div className="w-2.5 h-2.5 bg-green-600 rounded-full shrink-0 mt-1"></div>
        )}
      </div>
    </button>
  );
};

// ---------------- Emoji picker popover ----------------
const EmojiPicker = ({ onSelect }: { onSelect: (emoji: string) => void }) => (
  <div className="absolute bottom-12 right-0 w-64 max-h-48 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg p-2 grid grid-cols-8 gap-1 z-30">
    {EMOJI_LIST.map((emoji) => (
      <button
        key={emoji}
        type="button"
        onClick={() => onSelect(emoji)}
        className="text-lg hover:bg-gray-100 rounded p-1 transition-all"
      >
        {emoji}
      </button>
    ))}
  </div>
);

// ---------------- Chat window ----------------
const ChatWindow = ({
  currentChat,
  messages,
  messageText,
  setMessageText,
  handleSendMessage,
  onBack,
  isLoadingMessages,
  socketStatus,
  onReconnect,
}: {
  currentChat?: ChatThread;
  messages: ChatMessage[];
  messageText: string;
  setMessageText: (v: string) => void;
  handleSendMessage: () => void;
  onBack?: () => void;
  isLoadingMessages: boolean;
  socketStatus: SocketStatus;
  onReconnect: () => void;
  isMobile?: boolean;
}) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const emojiWrapperRef = useRef<HTMLDivElement | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Keep the thread pinned to the newest message, whenever the message
  // count changes or a different thread is opened.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, currentChat?.id]);

  // Close the emoji popover on outside click.
  useEffect(() => {
    if (!showEmojiPicker) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (emojiWrapperRef.current && !emojiWrapperRef.current.contains(e.target as Node)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showEmojiPicker]);

  if (!currentChat) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <p className="text-sm text-gray-400 italic">Click a message to begin chat</p>
      </div>
    );
  }

  const other = getOtherParticipant(currentChat);
  const canSend = messageText.trim().length > 0 && socketStatus === "open";

  const statusLabel =
    socketStatus === "open"
      ? "Connected"
      : socketStatus === "connecting"
        ? "Connecting..."
        : socketStatus === "error"
          ? "Connection error"
          : "Disconnected";

  const handleEmojiSelect = (emoji: string) => {
    setMessageText(messageText.length < MAX_MESSAGE_LENGTH ? messageText + emoji : messageText);
  };

  return (
    <div className="flex flex-col bg-gray-50 h-full overflow-hidden">
      {/* Header */}
      <div className="mt-14 px-4 sm:px-8 py-4 border-b bg-gray-100 border-gray-200 flex items-center justify-between  shrink-0 z-20">
        <div className="flex items-center gap-3 min-w-0">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 -ml-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all shrink-0"
              aria-label="Back to chats"
            >
              <FiArrowLeft size={20} />
            </button>
          )}
          <div className="flex items-center gap-3 min-w-0">
            <Avatar src={other.profileImage} name={other.name} size={40} />
            <div className="min-w-0">
              <div className="flex items-center gap-2 min-w-0">
                <h2 className="font-bold text-sm text-gray-900 truncate">{other.name}</h2>
              </div>
              <div className="flex items-center gap-1.5">
                <p className={`text-xs ${socketStatus === "error" ? "text-red-500" : "text-gray-500"}`}>
                  {statusLabel}
                </p>
                {socketStatus === "error" && (
                  <button
                    onClick={onReconnect}
                    className="flex items-center gap-1 text-xs text-green-700 hover:text-green-800 font-medium"
                  >
                    <FiRefreshCw size={11} />
                    Reconnect
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages — only scrollable region */}
      <div
        className="flex-1 overflow-y-auto px-4 sm:px-8 py-6"
        style={{
          backgroundColor: "#e9edef",
          backgroundImage: `url("${CHAT_BG_PATTERN}")`,
          backgroundRepeat: "repeat",
        }}
      >
        {isLoadingMessages ? (
          <div className="flex items-center justify-center py-8">
            <FiLoader className="animate-spin text-green-700" size={24} />
          </div>
        ) : messages.length === 0 ? (
          <p className="text-xs text-gray-400 italic text-center py-8">No messages yet — say hello!</p>
        ) : (
          <div className="space-y-3">
            {messages.map((msg) => {
              const isMine = msg.sender?.role === CURRENT_USER_ROLE;
              const senderName = msg.sender?.full_name || (isMine ? "You" : other.name);

              return (
                <div key={msg.id} className={`flex items-end gap-2 ${isMine ? "justify-end" : "justify-start"}`}>
                  {!isMine && (
                    <Avatar src={msg.sender?.profile_image} name={senderName} size={28} />
                  )}

                  <div className={`flex flex-col ${isMine ? "items-end" : "items-start"} max-w-[75%]`}>
                    {!isMine && (
                      <span className="text-[10px] italic text-gray-500 font-medium mb-0.5 px-1 truncate max-w-full">
                        {senderName}
                      </span>
                    )}
                    <div
                      className={`px-4 py-2.5 rounded-2xl ${isMine
                        ? "bg-green-900 text-white rounded-br-none"
                        : "bg-gray-50 text-gray-900 rounded-bl-none"
                        }`}
                    >
                      <p className="text-sm break-words whitespace-pre-wrap">{msg.content}</p>
                      <p className={`text-xs mt-1 ${isMine ? "text-green-100" : "text-gray-600"}`}>
                        {formatMessageTime(msg.created_at)}
                      </p>
                    </div>
                  </div>

                  {isMine && (
                    <Avatar src={msg.sender?.profile_image} name={senderName} size={28} />
                  )}
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input bar */}
      <div className="px-4 sm:px-8 py-3 border-t border-gray-100 bg-white shrink-0 z-20 bottom-0">
        <div className="flex items-end gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={(e) => {
                // Ignore Enter while an IME composition is in progress
                // (e.g. typing accented or CJK characters), so a
                // half-composed word never gets sent early.
                if (e.key === "Enter" && !e.nativeEvent.isComposing) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Type a message..."
              maxLength={MAX_MESSAGE_LENGTH}
              className="w-full px-4 py-2.5 pr-10 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2" ref={emojiWrapperRef}>
              <button
                type="button"
                onClick={() => setShowEmojiPicker((v) => !v)}
                className="text-gray-600 hover:text-gray-900 transition-all"
                aria-label="Insert emoji"
              >
                <FiSmile size={18} />
              </button>
              {showEmojiPicker && <EmojiPicker onSelect={handleEmojiSelect} />}
            </div>
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!canSend}
            title={socketStatus !== "open" ? "Reconnecting — please wait" : undefined}
            className={`p-2.5 rounded-lg transition-all shrink-0 ${canSend
              ? "bg-green-700 text-white hover:bg-green-600"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            aria-label="Send message"
          >
            <FiSend size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TutorMessages;