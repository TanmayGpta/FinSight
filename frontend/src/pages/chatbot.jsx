import React, { useState, useRef, useEffect } from "react";
import { Send, MessageCircle, MoreVertical } from "lucide-react";
import Sidebar from "../components/ui/SideBar";

const cn = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

export default function Chatbot() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI Assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(Date.now() - 60000),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (input.trim() === "") return;

    const userMessage = {
      id: Date.now(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    setTimeout(() => {
      const botMessage = {
        id: Date.now() + 1,
        text: generateBotResponse(input),
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsLoading(false);
    }, 800);
  };

  const generateBotResponse = (userInput) => {
    const responses = {
      hello: "Hello! How can I assist you with your microfinance operations today?",
      loans: "I can help you with information about loan management. What would you like to know?",
      customers: "I have access to customer information and analytics. What do you need?",
      branches: "I can provide information about branch performance and operations.",
      reports: "I can help you generate and understand various reports. Which report would you like?",
      default:
        "Thank you for your question. I'm here to help with any inquiries about your microfinance operations. Could you provide more details?",
    };

    const input_lower = userInput.toLowerCase();
    for (const [key, value] of Object.entries(responses)) {
      if (key !== "default" && input_lower.includes(key)) {
        return value;
      }
    }
    return responses.default;
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />

      <main className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b border-slate-200 bg-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                AI Assistant
              </h1>
              <p className="text-sm text-slate-600">
                Ask questions about your microfinance operations
              </p>
            </div>
            <button className="rounded-lg p-2 text-slate-600 hover:bg-slate-100">
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex flex-1 flex-col overflow-y-auto">
          <div className="flex flex-col space-y-4 p-6">
            {messages.length === 0 ? (
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <MessageCircle className="mx-auto h-16 w-16 text-slate-300" />
                  <p className="mt-4 text-slate-600">
                    No conversations yet. Start by asking a question!
                  </p>
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-3",
                    message.sender === "user" ? "justify-end" : "justify-start",
                  )}
                >
                  {message.sender === "bot" && (
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 flex-shrink-0">
                      <MessageCircle className="h-5 w-5 text-white" />
                    </div>
                  )}

                  <div
                    className={cn(
                      "max-w-md rounded-lg px-4 py-3 text-sm",
                      message.sender === "user"
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-200 text-slate-900",
                    )}
                  >
                    <p>{message.text}</p>
                    <p
                      className={cn(
                        "mt-1 text-xs",
                        message.sender === "user"
                          ? "text-emerald-100"
                          : "text-slate-600",
                      )}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  {message.sender === "user" && (
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-300 flex-shrink-0">
                      <span className="text-xs font-bold text-white">U</span>
                    </div>
                  )}
                </div>
              ))
            )}

            {isLoading && (
              <div className="flex gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 flex-shrink-0">
                  <MessageCircle className="h-5 w-5 text-white" />
                </div>
                <div className="flex items-center gap-1 rounded-lg bg-slate-200 px-4 py-3">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-slate-600"></div>
                  <div className="h-2 w-2 animate-pulse rounded-full bg-slate-600 delay-100"></div>
                  <div className="h-2 w-2 animate-pulse rounded-full bg-slate-600 delay-200"></div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-slate-200 bg-white p-6">
          <div className="flex gap-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask a question... (Shift+Enter for new line)"
              rows="3"
              disabled={isLoading}
              className="flex-1 resize-none rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-500 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-50 disabled:text-slate-500"
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || input.trim() === ""}
              className="flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-3 text-white hover:bg-emerald-700 disabled:bg-slate-300 transition-colors flex-shrink-0"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
