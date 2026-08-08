import { useEffect, useMemo, useRef, useState } from "react";
import { FiArrowLeft, FiFilter, FiMoreVertical, FiPaperclip, FiPhone, FiSearch, FiSend, FiSmile, FiVideo } from "react-icons/fi";
import { useLocation } from "react-router-dom";
import { useGetChats, useGetSingleChat } from "../../hooks/queries/allQueries";

const TOP_NAV_HEIGHT = 120;
const DESKTOP_NAV_HEIGHT = 20;
const MOBILE_BOTTOM_NAV_HEIGHT = 10;

const WS_BASE_URL = "wss://api.welearnglobal.online/";
const getAccessToken = () => localStorage.getItem("welearnToken") || "";

// TODO: replace with the real signed-in tutor's id, e.g. from useAuth()
const useCurrentUserId = () => {
  const token = getAccessToken();
  console.log("Current user token:", token);
  return null as number | null;
};

interface ChatThread {
  id: number;
  student: number;
  tutor: number;
  created_at: string;
  other_participant_name: string;
  last_message: string | null;
  unread_count: number;
}

interface ChatMessage {
  id: number;
  thread: number;
  sender: number;
  sender_name: string;
  content: string;
  created_at: string;
  read_at: string | null;
}

const formatMessageTime = (iso: string) => {
  if (!iso) return "";
  return new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
};

const initialsFor = (name: string) =>
  name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "?";

const TutorMessages = () => {
  const location = useLocation() as { state?: { chatId?: number } };
  const currentUserId = useCurrentUserId();

  const [selectedChat, setSelectedChat] = useState<number | null>(location.state?.chatId ?? null);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [liveMessages, setLiveMessages] = useState<ChatMessage[]>([]);
  const [socketStatus, setSocketStatus] = useState<"idle" | "connecting" | "open" | "error">("idle");
  const socketRef = useRef<WebSocket | null>(null);

  const { getChats, isLoading: isLoadingChats } = useGetChats();
  const chats: ChatThread[] = Array.isArray(getChats?.data)
    ? getChats.data
    : Array.isArray(getChats)
      ? getChats
      : [];

  const { getSingleChat, isLoading: isLoadingMessages } = useGetSingleChat(selectedChat);
  const messageHistory: ChatMessage[] = Array.isArray(getSingleChat?.data?.results)
    ? getSingleChat.data.results
    : [];

  const filteredChats = useMemo(() => {
    if (!searchQuery.trim()) return chats;
    const q = searchQuery.toLowerCase();
    return chats.filter((c) => c.other_participant_name?.toLowerCase().includes(q));
  }, [chats, searchQuery]);

  const currentChat = chats.find((c) => c.id === selectedChat);

  // Merge REST history with anything that's arrived live over the socket
  // since opening the thread, de-duped by id.
  const messages = useMemo(() => {
    const byId = new Map<number, ChatMessage>();
    [...messageHistory, ...liveMessages].forEach((m) => byId.set(m.id, m));
    return Array.from(byId.values()).sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
  }, [messageHistory, liveMessages]);

  // Open a fresh socket whenever the selected thread changes; close it on
  // cleanup so we never leave a stale connection open while the tutor
  // browses other chats or navigates away.
  useEffect(() => {
    setLiveMessages([]);

    if (selectedChat === null) return;

    setSocketStatus("connecting");
    const token = getAccessToken();
    const socket = new WebSocket(`${WS_BASE_URL}/ws/chat/${selectedChat}/?token=${token}`);
    socketRef.current = socket;

    socket.onopen = () => setSocketStatus("open");

    socket.onmessage = (event) => {
      try {
        const incoming: ChatMessage = JSON.parse(event.data);
        setLiveMessages((prev) => [...prev, incoming]);
      } catch (err) {
        console.error("Failed to parse chat socket message:", err);
      }
    };

    socket.onerror = () => setSocketStatus("error");

    socket.onclose = (event) => {
      setSocketStatus("idle");
      if (event.code === 4001) {
        // Token missing/invalid/expired.
        // TODO: refresh the access token and reconnect here.
        console.warn("Chat socket closed: re-authentication required");
      } else if (event.code === 4003) {
        // Not a participant in this thread — don't retry.
        console.warn("Chat socket closed: not a participant in this thread");
      }
    };

    return () => {
      socket.close();
      socketRef.current = null;
    };
  }, [selectedChat]);

  const handleSendMessage = () => {
    const trimmed = messageText.trim();
    if (!trimmed) return;

    const socket = socketRef.current;
    if (!socket || socket.readyState !== WebSocket.OPEN) return;

    socket.send(JSON.stringify({ content: trimmed }));
    setMessageText("");
    // Intentionally not appending optimistically — the server echoes the
    // message back over the same socket for both participants.
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
          {/* Fixed search/filter header */}
          <div className="px-8 py-6 border-b border-gray-100 shrink-0">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Messages</h2>
            <div className="flex items-center gap-2">
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
              <button className="p-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
                <FiFilter size={18} />
              </button>
            </div>
          </div>

          {/* Scrollable chat items */}
          <div className="flex-1 overflow-y-auto">
            {isLoadingChats ? (
              <p className="text-xs text-gray-400 italic text-center py-8">Loading conversations...</p>
            ) : filteredChats.length === 0 ? (
              <p className="text-xs text-gray-400 italic text-center py-8">No conversations yet</p>
            ) : (
              filteredChats.map((chat) => (
                <ChatListItem
                  key={chat.id}
                  chat={chat}
                  // On desktop, highlight the first chat by default when nothing is selected
                  isActive={(selectedChat ?? filteredChats[0]?.id) === chat.id}
                  onSelect={() => setSelectedChat(chat.id)}
                />
              ))
            )}
          </div>
        </div>

        <div className="col-span-3 h-full overflow-hidden">
          <ChatWindow
            currentChat={chats.find((c) => c.id === (selectedChat ?? filteredChats[0]?.id))}
            messages={messages}
            currentUserId={currentUserId}
            messageText={messageText}
            setMessageText={setMessageText}
            handleSendMessage={handleSendMessage}
            isLoadingMessages={isLoadingMessages}
            socketStatus={socketStatus}
          />
        </div>
      </div>

      <div
        className={"md:hidden overflow-x-hidden overflow-y-hidden w-full"}
        style={{ height: `calc(100vh - ${TOP_NAV_HEIGHT}px - ${MOBILE_BOTTOM_NAV_HEIGHT}px)` }}
      >
        {selectedChat !== null ? (
          /* ── Chat window (drill-in view) ── */
          <ChatWindow
            currentChat={currentChat}
            messages={messages}
            currentUserId={currentUserId}
            messageText={messageText}
            setMessageText={setMessageText}
            handleSendMessage={handleSendMessage}
            onBack={() => setSelectedChat(null)}
            isLoadingMessages={isLoadingMessages}
            socketStatus={socketStatus}
            isMobile
          />
        ) : (
          /* ── Chat list (default mobile view) ── */
          <div className="flex flex-col bg-white h-full w-full overflow-hidden pt-14">
            <div className="px-4 py-4 border-b border-gray-100 shrink-0">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Messages</h2>
              <div className="flex items-center gap-2">
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
                <button className="p-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
                  <FiFilter size={18} />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {isLoadingChats ? (
                <p className="text-xs text-gray-400 italic text-center py-8">Loading conversations...</p>
              ) : filteredChats.length === 0 ? (
                <p className="text-xs text-gray-400 italic text-center py-8">No conversations yet</p>
              ) : (
                filteredChats.map((chat) => (
                  <ChatListItem
                    key={chat.id}
                    chat={chat}
                    isActive={false} // nothing active on the list view
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
}) => (
  <button
    onClick={onSelect}
    className={`w-full box-border ${mobile ? "px-4" : "px-8"} py-4 border-b border-gray-50 text-left hover:bg-gray-50 transition-all ${isActive ? "bg-green-50 border-l-4 border-l-green-600" : ""
      }`}
  >
    <div className="flex items-start gap-3">
      <div className="relative shrink-0">
        <div className="w-12 h-12 rounded-full bg-green-900 flex items-center justify-center text-white font-semibold text-sm">
          {initialsFor(chat.other_participant_name)}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1 gap-2">
          <h3 className={`font-semibold text-sm text-gray-900 truncate ${chat.unread_count > 0 ? "font-bold" : ""}`}>
            {chat.other_participant_name}
          </h3>
        </div>
        <p className={`text-xs w-full truncate ${chat.unread_count > 0 ? "text-gray-900 font-medium" : "text-gray-600"}`}>
          {chat.last_message || "No messages yet"}
        </p>
      </div>

      {chat.unread_count > 0 && (
        <div className="w-2.5 h-2.5 bg-green-600 rounded-full shrink-0 mt-1"></div>
      )}
    </div>
  </button>
);

// ---------------- Chat window ----------------
const ChatWindow = ({
  currentChat,
  messages,
  currentUserId,
  messageText,
  setMessageText,
  handleSendMessage,
  onBack,
  isLoadingMessages,
  socketStatus,
}: {
  currentChat?: ChatThread;
  messages: ChatMessage[];
  currentUserId: number | null;
  messageText: string;
  setMessageText: (v: string) => void;
  handleSendMessage: () => void;
  onBack?: () => void;
  isLoadingMessages: boolean;
  socketStatus: "idle" | "connecting" | "open" | "error";
  isMobile?: boolean;
}) => {
  if (!currentChat) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <p className="text-sm text-gray-400 italic">Select a conversation to start messaging</p>
      </div>
    );
  }

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
            <div className="relative shrink-0">
              <div className="w-10 h-10 rounded-full bg-green-900 flex items-center justify-center text-white font-semibold text-sm">
                {initialsFor(currentChat.other_participant_name)}
              </div>
            </div>
            <div className="min-w-0">
              <h2 className="font-bold text-sm text-gray-900 truncate">
                {currentChat.other_participant_name}
              </h2>
              <p className="text-xs text-gray-500">
                {socketStatus === "open" ? "Connected" : socketStatus === "connecting" ? "Connecting..." : socketStatus === "error" ? "Connection error" : ""}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button className="p-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
            <FiPhone size={18} />
          </button>
          <button className="p-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
            <FiVideo size={18} />
          </button>
          <button className="p-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
            <FiMoreVertical size={18} />
          </button>
        </div>
      </div>

      {/* Messages — only scrollable region */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6">
        {isLoadingMessages ? (
          <p className="text-xs text-gray-400 italic text-center py-8">Loading messages...</p>
        ) : messages.length === 0 ? (
          <p className="text-xs text-gray-400 italic text-center py-8">No messages yet — say hello!</p>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => {
              const isMine = msg.sender === currentUserId;
              return (
                <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-xs px-4 py-2.5 rounded-2xl ${isMine
                      ? "bg-green-700 text-white rounded-br-none"
                      : "bg-gray-100 text-gray-900 rounded-bl-none"
                      }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <p className={`text-xs mt-1 ${isMine ? "text-green-100" : "text-gray-600"}`}>
                      {formatMessageTime(msg.created_at)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Input bar */}
      <div className="px-4 sm:px-8 py-3 border-t border-gray-100 bg-white shrink-0 z-20 bottom-0">
        <div className="flex items-end gap-3">
          <button className="p-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-all shrink-0">
            <FiPaperclip size={18} />
          </button>
          <div className="flex-1 relative">
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Type a message..."
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900 transition-all">
              <FiSmile size={18} />
            </button>
          </div>
          <button
            onClick={handleSendMessage}
            className="p-2.5 bg-green-700 text-white rounded-lg hover:bg-green-600 transition-all shrink-0"
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