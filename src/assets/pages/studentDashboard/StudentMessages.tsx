import { useState } from "react";
import { FiArrowLeft, FiFilter, FiMoreVertical, FiPaperclip, FiPhone, FiSearch, FiSend, FiSmile, FiVideo } from "react-icons/fi";

const StudentMessages = () => {
    const [selectedChat, setSelectedChat] = useState<number | null>(1);
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
    ]);

    const chats = [
        {
            id: 1,
            name: "Dr. Sarah Jenkins",
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

    const quickReplies = [
        "Confirm Tuesday 4 PM",
        "Reschedule next week",
        "Send homework files",
        "Request extra session",
    ];

    const currentChat = chats.find(c => c.id === selectedChat);

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
        <div className="md:pl-56 pb-20 md:pb-8 w-full">
            <div className="min-h-screen bg-white">
                {/* Desktop Layout */}
                <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-0 h-[calc(100vh-64px)]">
                    {/* Chat List - Fixed */}
                    <div className="flex flex-col bg-white border-r border-gray-100 h-full">
                        {/* Search and Filter */}
                        <div className="px-8 py-6 border-b border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Messages</h2>
                            <div className="flex items-center gap-2">
                                <div className="flex-1 relative">
                                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input
                                        type="text"
                                        placeholder="Search chats..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 bg-gray-50 transition-all"
                                    />
                                </div>
                                <button className="p-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
                                    <FiFilter size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Chat Items - Scrollable */}
                        <div className="flex-1 overflow-y-auto">
                            {chats.map((chat) => (
                                <button
                                    key={chat.id}
                                    onClick={() => setSelectedChat(chat.id)}
                                    className={`w-full px-8 py-4 border-b border-gray-50 text-left hover:bg-gray-50 transition-all ${selectedChat === chat.id ? "bg-emerald-50 border-l-4 border-l-emerald-600" : ""
                                        }`}
                                >
                                    <div className="flex items-start gap-3">
                                        {/* Avatar with Status */}
                                        <div className="relative flex-shrink-0">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-semibold text-sm">
                                                {chat.avatar}
                                            </div>
                                            {chat.online && (
                                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-md"></div>
                                            )}
                                        </div>

                                        {/* Chat Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1 gap-2">
                                                <h3 className={`font-semibold text-sm text-gray-900 truncate ${chat.unread ? "font-bold" : ""}`}>
                                                    {chat.name}
                                                </h3>
                                                <span className={`text-xs flex-shrink-0 ${chat.unread ? "text-emerald-600 font-semibold" : "text-gray-500"}`}>
                                                    {chat.timestamp}
                                                </span>
                                            </div>
                                            <p className="text-xs text-emerald-600 font-medium mb-1 truncate">
                                                {chat.subject}
                                            </p>
                                            <p className={`text-xs truncate ${chat.unread ? "text-gray-900 font-medium" : "text-gray-600"}`}>
                                                {chat.lastMessage}
                                            </p>
                                        </div>

                                        {/* Unread Badge */}
                                        {chat.unread && (
                                            <div className="w-2.5 h-2.5 bg-emerald-600 rounded-full flex-shrink-0 mt-1"></div>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Chat Window */}
                    {selectedChat && (
                        <ChatWindow
                            currentChat={currentChat}
                            messages={messages}
                            messageText={messageText}
                            setMessageText={setMessageText}
                            handleSendMessage={handleSendMessage}
                            quickReplies={quickReplies}
                        />
                    )}
                </div>

                {/* Mobile Layout */}
                <div className="md:hidden h-[calc(100vh-64px)] flex flex-col">
                    {selectedChat ? (
                        <ChatWindow
                            currentChat={currentChat}
                            messages={messages}
                            messageText={messageText}
                            setMessageText={setMessageText}
                            handleSendMessage={handleSendMessage}
                            quickReplies={quickReplies}
                            onBack={() => setSelectedChat(null)}
                        />
                    ) : (
                        <div className="flex flex-col bg-white border-r border-gray-100 h-full">
                            <div className="px-4 sm:px-6 py-4 border-b border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Messages</h2>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 relative">
                                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                        <input
                                            type="text"
                                            placeholder="Search chats..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 bg-gray-50 transition-all"
                                        />
                                    </div>
                                    <button className="p-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
                                        <FiFilter size={18} />
                                    </button>
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-auto">
                                {chats.map((chat) => (
                                    <button
                                        key={chat.id}
                                        onClick={() => setSelectedChat(chat.id)}
                                        className={`w-full px-4 sm:px-6 py-4 border-b border-gray-50 text-left hover:bg-gray-50 transition-all ${selectedChat === chat.id ? "bg-emerald-50 border-l-4 border-l-emerald-600" : ""
                                            }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="relative flex-shrink-0">
                                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-semibold text-sm">
                                                    {chat.avatar}
                                                </div>
                                                {chat.online && (
                                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-md"></div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1 gap-2">
                                                    <h3 className={`font-semibold text-sm text-gray-900 truncate ${chat.unread ? "font-bold" : ""}`}>
                                                        {chat.name}
                                                    </h3>
                                                    <span className={`text-xs flex-shrink-0 ${chat.unread ? "text-emerald-600 font-semibold" : "text-gray-500"}`}>
                                                        {chat.timestamp}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-emerald-600 font-medium mb-1 truncate">
                                                    {chat.subject}
                                                </p>
                                                <p className={`text-xs truncate ${chat.unread ? "text-gray-900 font-medium" : "text-gray-600"}`}>
                                                    {chat.lastMessage}
                                                </p>
                                            </div>
                                            {chat.unread && (
                                                <div className="w-2.5 h-2.5 bg-emerald-600 rounded-full flex-shrink-0 mt-1"></div>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const ChatWindow = ({
    currentChat,
    messages,
    messageText,
    setMessageText,
    handleSendMessage,
    quickReplies,
    onBack
}: any) => {
    return (
        <div className="flex flex-col bg-white h-full md:col-span-2">
            {/* Chat Header - Fixed */}
            <div className="px-4 sm:px-8 py-4 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-20 shadow-sm">
                <div className="flex items-center gap-3 min-w-0">
                    {onBack && (
                        <button
                            onClick={onBack}
                            className="p-2 -ml-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all md:hidden"
                            aria-label="Go back"
                        >
                            <FiArrowLeft size={20} />
                        </button>
                    )}
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="relative flex-shrink-0">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-semibold text-sm">
                                {currentChat?.avatar}
                            </div>
                            {currentChat?.online && (
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                            )}
                        </div>
                        <div className="min-w-0">
                            <h2 className="font-bold text-gray-900 text-lg truncate">{currentChat?.name}</h2>
                            <p className="text-xs text-emerald-600 font-medium">{currentChat?.subject}</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
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

            {/* Messages Area - Scrollable */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6">
                <div className="space-y-4">
                    {messages.map((msg: any) => (
                        <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                            <div className={`max-w-xs px-4 py-2.5 rounded-2xl ${msg.sender === "user"
                                ? "bg-emerald-500 text-white rounded-br-none"
                                : "bg-gray-100 text-gray-900 rounded-bl-none"
                                }`}>
                                <p className="text-sm">{msg.text}</p>
                                {msg.attachment && (
                                    <div className="mt-2 text-xs opacity-75">{msg.attachment.name}</div>
                                )}
                                <p className={`text-xs mt-1 ${msg.sender === "user" ? "text-emerald-100" : "text-gray-600"}`}>
                                    {msg.time}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Replies */}
            {messages.length < 10 && (
                <div className="px-4 sm:px-8 py-4 border-t border-gray-100">
                    <p className="text-xs text-gray-600 font-semibold mb-3">Quick Replies</p>
                    <div className="flex flex-wrap gap-2">
                        {quickReplies.map((reply, idx) => (
                            <button
                                key={idx}
                                onClick={() => setMessageText(reply)}
                                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-xs hover:bg-gray-200 transition-all"
                            >
                                {reply}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Message Input - Fixed */}
            <div className="px-4 sm:px-8 py-4 border-t border-gray-100 bg-white sticky bottom-0 z-20">
                <div className="flex items-end gap-3">
                    <button className="p-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-all flex-shrink-0">
                        <FiPaperclip size={18} />
                    </button>
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                            placeholder="Type a message..."
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                        />
                        <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900 transition-all">
                            <FiSmile size={18} />
                        </button>
                    </div>
                    <button
                        onClick={handleSendMessage}
                        className="p-2.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all flex-shrink-0"
                    >
                        <FiSend size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StudentMessages;
