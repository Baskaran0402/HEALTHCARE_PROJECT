import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, User, Bot, Sparkles } from 'lucide-react'
import { healthAPI } from '../services/api'
import './KiraChat.css'

const KiraChat = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { 
      role: 'bot', 
      content: 'Hello! I am Kira, your AI health assistant. I can help you with health questions or book an appointment. How can I assist you today?' 
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
    }
  }, [messages, isOpen])

  const handleSend = async () => {
    if (!inputValue.trim()) return

    const userMsg = { role: 'user', content: inputValue }
    setMessages(prev => [...prev, userMsg])
    setInputValue('')
    setIsLoading(true)

    try {
      // Serialize history correctly
      const history = messages.map(m => ({
        role: m.role === 'bot' ? 'assistant' : 'user',
        content: m.content
      }))

      const result = await healthAPI.chatWithKira({
        message: userMsg.content,
        history: history
      })

      const botMsg = { role: 'bot', content: result.response }
      setMessages(prev => [...prev, botMsg])
      
    } catch (error) {
      console.error("Chat error:", error)
      setMessages(prev => [...prev, { role: 'bot', content: "I'm having trouble connecting right now. Please try again." }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="kira-widget-container">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="kira-chat-window"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            {/* Header */}
            <div className="kira-header">
              <div className="kira-profile">
                <div className="kira-avatar">
                  <Sparkles size={20} />
                </div>
                <div className="kira-info">
                  <h3>Kira AI</h3>
                  <p><span className="kira-status-dot"></span>Online Assistant</p>
                </div>
              </div>
              <button className="kira-close-btn" onClick={() => setIsOpen(false)}>
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="kira-messages">
              {messages.map((msg, idx) => (
                <motion.div 
                  key={idx} 
                  className={`message-group ${msg.role}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="message-avatar">
                    {msg.role === 'bot' ? <Bot size={16} /> : <User size={16} />}
                  </div>
                  <div className="message-bubble">
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              
              {isLoading && (
                <div className="message-group bot">
                  <div className="message-avatar">
                    <Bot size={16} />
                  </div>
                  <div className="message-bubble typing-indicator">
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="kira-input-area">
              <textarea
                className="kira-input"
                placeholder="Ask a health question or book appointment..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                rows={1}
              />
              <button 
                className="kira-send-btn" 
                onClick={handleSend}
                disabled={isLoading || !inputValue.trim()}
              >
                <Send size={20} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        className="kira-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
      </motion.button>
    </div>
  )
}

export default KiraChat
