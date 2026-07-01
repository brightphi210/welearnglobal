import { useState } from "react";
import { FiArrowLeft, FiFilter, FiMoreVertical, FiPaperclip, FiPhone, FiSearch, FiSend, FiSmile, FiVideo } from "react-icons/fi";

const TOP_NAV_HEIGHT = 120;
const DESKTOP_NAV_HEIGHT = 20;
const MOBILE_BOTTOM_NAV_HEIGHT = 10;

const TutorMessages = () => {
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "tutor",
      text: "Hi Alex! I've reviewed your last assignment on electromagnetism.",
      time: "10:15 AM",
      date: "TODAY, OCTOBER 24",
    },
    {
      id: 2,
      sender: "user",
      text: "Thanks Dr. Sarah! I had some trouble with the Faraday's Law problems.",
      time: "10:20 AM",
      date: "TODAY, OCTOBER 24",
    },
    {
      id: 3,
      sender: "tutor",
      text: "No worries, we can go over that in our next lesson. I've attached a cheat sheet that might help.",
      time: "10:22 AM",
      date: "TODAY, OCTOBER 24",
      attachment: {
        name: "Faradays_Law_Guide.pdf",
        type: "pdf",
      },
    },
    {
      id: 4,
      sender: "user",
      text: "Would you like to schedule a 30-minute follow-up this Tuesday?",
      time: "10:23 AM",
      date: "TODAY, OCTOBER 24",
    },
    {
      id: 5,
      sender: "tutor",
      text: "Absolutely! I have availability. Let me send you a session proposal.",
      time: "10:25 AM",
      date: "TODAY, OCTOBER 24",
      proposal: {
        date: "Tuesday, Oct 26 • 04:00 PM (1 hr)",
      },
    },

    {
      id: 5,
      sender: "tutor",
      text: "Absolutely! I have availability. Let me send you a session proposal.",
      time: "10:25 AM",
      date: "TODAY, OCTOBER 24",
      proposal: {
        date: "Tuesday, Oct 26 • 04:00 PM (1 hr)",
      },
    },

    {
      id: 5,
      sender: "tutor",
      text: "Absolutely! I have availability. Let me send you a session proposal.",
      time: "10:25 AM",
      date: "TODAY, OCTOBER 24",
      proposal: {
        date: "Tuesday, Oct 26 • 04:00 PM (1 hr)",
      },
    },

    {
      id: 5,
      sender: "user",
      text: "Absolutely! I have availability. Let me send you a session proposal.",
      time: "10:25 AM",
      date: "TODAY, OCTOBER 24",
      proposal: {
        date: "Tuesday, Oct 26 • 04:00 PM (1 hr)",
      },
    },

  ]);

  const chats = [
    {
      id: 1,
      name: "Dr. Sarah Jenkins have availability. Let me send you a session proposal",
      subject: "Advanced Physics",
      lastMessage: "Absolutely! I have availability. Let me send you a session proposal.",
      timestamp: "10:25 AM",
      avatar: "SJ",
      unread: false,
      online: true,
    },
    {
      id: 2,
      name: "Marcus Thompson",
      subject: "Calculus II",
      lastMessage: "Does Wednesday at 4 PM work for you?",
      timestamp: "2 hours ago",
      avatar: "MT",
      unread: true,
      online: false,
    },
    {
      id: 3,
      name: "Elena Rodriguez",
      subject: "Spanish Literature",
      lastMessage: "¡Excelente trabajo! Keep practicing the verb conjugations",
      timestamp: "Yesterday",
      avatar: "ER",
      unread: false,
      online: false,
    },
    {
      id: 4,
      name: "James Wilson",
      subject: "Web Development",
      lastMessage: "I sent you the GitHub repository link.",
      timestamp: "3 days ago",
      avatar: "JW",
      unread: false,
      online: false,
    },
  ];

  const currentChat = chats.find((c) => c.id === selectedChat);

  const handleSendMessage = () => {
    if (messageText.trim()) {
      const newMessage = {
        id: messages.length + 1,
        sender: "user",
        text: messageText,
        time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
        date: "TODAY",
      };
      setMessages([...messages, newMessage]);
      setMessageText("");
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
            {chats.map((chat) => (
              <ChatListItem
                key={chat.id}
                chat={chat}
                // On desktop, highlight chat 1 by default when nothing is selected
                isActive={(selectedChat ?? 1) === chat.id}
                onSelect={() => setSelectedChat(chat.id)}
              />
            ))}
          </div>
        </div>

        <div className="col-span-3 h-full overflow-hidden">
          <ChatWindow
            currentChat={chats.find((c) => c.id === (selectedChat ?? 1))}
            messages={messages}
            messageText={messageText}
            setMessageText={setMessageText}
            handleSendMessage={handleSendMessage}
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
            messageText={messageText}
            setMessageText={setMessageText}
            handleSendMessage={handleSendMessage}
            onBack={() => setSelectedChat(null)}
            isMobile
          />
        ) : (
          /* ── Chat list (default mobile view) ── */
          <>
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
                {chats.map((chat) => (
                  <ChatListItem
                    key={chat.id}
                    chat={chat}
                    isActive={false} // nothing active on the list view
                    onSelect={() => setSelectedChat(chat.id)}
                    mobile
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ---------------- Chat list row ----------------
const ChatListItem = ({ chat, isActive, onSelect, mobile }: any) => (
  <button
    onClick={onSelect}
    className={`w-full box-border ${mobile ? "px-4" : "px-8"} py-4 border-b border-gray-50 text-left hover:bg-gray-50 transition-all ${isActive ? "bg-green-50 border-l-4 border-l-green-600" : ""
      }`}
  >
    <div className="flex items-start gap-3">
      <div className="relative shrink-0">
        <div className="w-12 h-12 rounded-full bg-green-900 flex items-center justify-center text-white font-semibold text-sm">
          {chat.avatar}
        </div>
        {chat.online && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-800 rounded-full border-2 border-white shadow-md"></div>
        )}
      </div>

      <div className="flex-1 ">
        <div className="flex items-center justify-between mb-1 gap-2">
          <h3 className={`font-semibold text-sm text-gray-900 ${chat.unread ? "font-bold" : ""}`}>
            {chat.name}
          </h3>
          <span className={`text-xs shrink-0 ${chat.unread ? "text-green-600 font-semibold" : "text-gray-500"}`}>
            {chat.timestamp}
          </span>
        </div>
        <p className="text-xs text-green-600 font-medium mb-1">{chat.subject}</p>
        <p className={`text-xs w-full ${chat.unread ? "text-gray-900 font-medium" : "text-gray-600"}`}>
          {chat.lastMessage}
        </p>
      </div>

      {chat.unread && <div className="w-2.5 h-2.5 bg-green-600 rounded-full shrink-0 mt-1"></div>}
    </div>
  </button>
);

// ---------------- Chat window ----------------
const ChatWindow = ({
  currentChat,
  messages,
  messageText,
  setMessageText,
  handleSendMessage,
  onBack,
}: any) => {
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
          <button
            onClick={onBack}
            disabled={!onBack}
            className={`flex items-center gap-3 min-w-0 text-left ${onBack ? "cursor-pointer" : "cursor-default"}`}
          >
            <div className="relative shrink-0">
              <div className="w-10 h-10 rounded-full bg-green-900 flex items-center justify-center text-white font-semibold text-sm">
                {currentChat?.avatar}
              </div>
              {currentChat?.online && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-800 rounded-full border-2 border-white"></div>
              )}
            </div>
            <div className="min-w-0">
              {currentChat?.name.length > 20 ?
                <h2 className="font-bold text-sm text-gray-900">{currentChat?.name.slice(0, 20)}...</h2> :
                <h2 className="font-bold text-sm text-gray-900">{currentChat?.name}</h2>
              }
              <p className="text-xs text-green-600 font-medium">{currentChat?.subject}</p>
            </div>
          </button>
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
        <div className="space-y-4">
          {messages.map((msg: any) => (
            <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-xs px-4 py-2.5 rounded-2xl ${msg.sender === "user"
                  ? "bg-green-700 text-white rounded-br-none"
                  : "bg-gray-100 text-gray-900 rounded-bl-none"
                  }`}
              >
                <p className="text-sm">{msg.text}</p>
                {msg.attachment && <div className="mt-2 text-xs opacity-75">{msg.attachment.name}</div>}
                <p className={`text-xs mt-1 ${msg.sender === "user" ? "text-green-100" : "text-gray-600"}`}>
                  {msg.time}
                </p>
              </div>
            </div>
          ))}
        </div>
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