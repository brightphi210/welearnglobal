import { useState } from "react";
import { FiFilter, FiMoreVertical, FiPaperclip, FiPhone, FiSearch, FiSend, FiSmile, FiVideo } from "react-icons/fi";

const StudentMessages = () => {
    const [selectedChat, setSelectedChat] = useState<number | null>(1);
    const [messageText, setMessageText] = useState("");
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
        <div className="md:pl-56 pb-20 md:pb-8">
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-0 h-[calc(100vh-64px)]">
                    {/* Chat List - Hidden on mobile when chat is selected */}
                    <div className={`${selectedChat && window.innerWidth < 768 ? "hidden" : "flex"} md:flex flex-col bg-white border-r border-gray-100`}>
                        {/* Search and Filter */}
                        <div className="p-4 border-b border-gray-100">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="flex-1 relative">
                                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input
                                        type="text"
                                        placeholder="Search chats..."
                                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                                    />
                                </div>
                                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
                                    <FiFilter size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Chat Items */}
                        <div className="flex-1 overflow-y-auto">
                            {chats.map((chat) => (
                                <button
                                    key={chat.id}
                                    onClick={() => setSelectedChat(chat.id)}
                                    className={`w-full px-4 py-4 border-b border-gray-50 text-left hover:bg-gray-50 transition-all ${selectedChat === chat.id ? "bg-emerald-50" : ""
                                        }`}
                                >
                                    <div className="flex items-start gap-3">
                                        {/* Avatar */}
                                        <div className="relative flex-shrink-0">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-semibold text-sm">
                                                {chat.avatar}
                                            </div>
                                            {chat.online && (
                                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></div>
                                            )}
                                        </div>

                                        {/* Chat Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <h3 className={`font-semibold text-gray-900 ${chat.unread ? "font-bold" : ""}`}>
                                                    {chat.name}
                                                </h3>
                                                <span className={`text-xs ${chat.unread ? "text-emerald-600 font-semibold" : "text-gray-500"}`}>
                                                    {chat.timestamp}
                                                </span>
                                            </div>
                                            <p className={`text-sm truncate ${chat.unread ? "text-gray-900 font-medium" : "text-gray-600"}`}>
                                                {chat.subject}
                                            </p>
                                            <p className={`text-xs truncate ${chat.unread ? "text-gray-700" : "text-gray-500"}`}>
                                                {chat.lastMessage}
                                            </p>
                                        </div>

                                        {/* Unread Badge */}
                                        {chat.unread && (
                                            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full flex-shrink-0"></div>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Chat Window */}
                    {selectedChat && (
                        <div className="md:col-span-2 flex flex-col bg-white">
                            {/* Chat Header */}
                            <div className="px-4 sm:px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setSelectedChat(null)}
                                        className="md:hidden text-gray-600 hover:text-gray-900"
                                    >
                                        ←
                                    </button>
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-semibold text-sm">
                                                {currentChat?.avatar}
                                            </div>
                                            {currentChat?.online && (
                                                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white"></div>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{currentChat?.name}</h3>
                                            <p className="text-xs text-emerald-600">{currentChat?.subject}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-2">
                                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all hidden sm:flex items-center justify-center">
                                        <FiPhone size={18} />
                                    </button>
                                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all hidden sm:flex items-center justify-center">
                                        <FiVideo size={18} />
                                    </button>
                                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
                                        <FiMoreVertical size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* Messages Area */}
                            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-4">
                                {/* Date Separator */}
                                <div className="flex items-center gap-3 my-4">
                                    <div className="flex-1 h-px bg-gray-200"></div>
                                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Today, October 24</span>
                                    <div className="flex-1 h-px bg-gray-200"></div>
                                </div>

                                {messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                                    >
                                        <div
                                            className={`max-w-xs lg:max-w-md ${message.sender === "user"
                                                ? "bg-emerald-500 text-white rounded-3xl rounded-tr-lg"
                                                : "bg-gray-100 text-gray-900 rounded-3xl rounded-tl-lg"
                                                } px-4 py-3`}
                                        >
                                            <p className="text-sm">{message.text}</p>
                                            {message.attachment && (
                                                <div className="mt-3 bg-black bg-opacity-10 rounded-lg p-3 flex items-center gap-2">
                                                    <FiPaperclip size={16} />
                                                    <span className="text-xs font-semibold">{message.attachment.name}</span>
                                                </div>
                                            )}
                                            {message.proposal && (
                                                <div className="mt-3 bg-black bg-opacity-10 rounded-lg p-3">
                                                    <div className="flex items-center gap-2 text-xs font-semibold">
                                                        📅 {message.proposal.date}
                                                    </div>
                                                </div>
                                            )}
                                            <span className={`text-xs mt-2 block opacity-70 ${message.sender === "user" ? "text-right" : ""}`}>
                                                {message.time}
                                            </span>
                                        </div>
                                    </div>
                                ))}

                                {/* Session Proposal Card */}
                                <div className="flex justify-start my-6">
                                    <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4 w-full sm:w-96">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="text-lg">📅</span>
                                            <h4 className="font-semibold text-gray-900">Next Session Proposal</h4>
                                        </div>
                                        <p className="text-sm text-gray-700 mb-4">
                                            Tuesday, Oct 26 • 04:00 PM (1 hr)
                                        </p>
                                        <div className="flex gap-3">
                                            <button className="flex-1 px-4 py-2 border border-emerald-300 text-emerald-600 rounded-lg font-semibold text-sm hover:bg-emerald-100 transition-all">
                                                Decline
                                            </button>
                                            <button className="flex-1 px-4 py-2 bg-emerald-500 text-white rounded-lg font-semibold text-sm hover:bg-emerald-600 transition-all">
                                                Accept & Pay
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Replies */}
                            <div className="px-4 sm:px-6 py-4 border-t border-gray-100">
                                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">Quick Reply:</p>
                                <div className="flex flex-wrap gap-2">
                                    {quickReplies.map((reply, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setMessageText(reply)}
                                            className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold hover:bg-emerald-200 transition-all"
                                        >
                                            {reply}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Message Input */}
                            <div className="px-4 sm:px-6 py-4 border-t border-gray-100 bg-gray-50">
                                <div className="flex items-end gap-3">
                                    <button className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-all hidden sm:flex items-center justify-center">
                                        <FiPaperclip size={18} />
                                    </button>
                                    <div className="flex-1">
                                        <input
                                            type="text"
                                            value={messageText}
                                            onChange={(e) => setMessageText(e.target.value)}
                                            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                                            placeholder="Message Dr. Sarah Jenkins..."
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all"
                                        />
                                    </div>
                                    <button className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-all">
                                        <FiSmile size={18} />
                                    </button>
                                    <button
                                        onClick={handleSendMessage}
                                        className="p-2.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all flex items-center justify-center"
                                    >
                                        <FiSend size={18} />
                                    </button>
                                </div>
                                <p className="text-xs text-gray-600 mt-2">
                                    Tip: Use scheduling chips above to quickly coordinate session times with your tutor.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentMessages;