import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, User, Bot, Sparkles, ChevronDown, Zap, Shield, Cpu } from 'lucide-react'
import chatService from '../services/chatService'
import { GlassCard } from './ui/GlassCard'
import { GlassButton } from './ui/GlassButton'

const KiraChat = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { 
      role: 'bot', 
      content: 'Initialization complete. I am Kira, your clinical diagnostic assistant. I can assist with real-time health queries or help orchestrate specialist consultations. How shall we proceed today?' 
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
      const history = messages.map(m => ({
        role: m.role === 'bot' ? 'assistant' : 'user',
        content: m.content
      }))

      const result = await chatService.chatWithKira({
        message: userMsg.content,
        history: history
      })

      const botMsg = { role: 'bot', content: result.response }
      setMessages(prev => [...prev, botMsg])
      
    } catch (error) {
      console.error("Chat error:", error)
      setMessages(prev => [...prev, { role: 'bot', content: "Protocol interruption. Unable to reach diagnostic neural net. Please attempt reconnection." }])
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
    <div className="fixed bottom-8 right-8 z-[1000] flex flex-col items-end pointer-events-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-[380px] max-w-[90vw] h-[600px] max-h-[80vh] mb-6 pointer-events-auto"
          >
            <div className="kira-glass h-full flex flex-col rounded-[2.5rem] overflow-hidden shadow-premium transition-all">
              {/* Premium Header */}
              <div className="p-6 bg-white/5 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#4f46e5] to-[#7c3aed] border border-white/10 flex items-center justify-center text-white shadow-xl">
                    <Sparkles size={24} className="animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white uppercase tracking-tighter leading-none mb-1">Kira <span className="text-[#4f46e5]">A.I.</span></h3>
                    <div className="flex items-center gap-2">
                       <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
                       <p className="text-[8px] font-black uppercase tracking-[0.3em] text-white/30">Clinical Uplink Active</p>
                    </div>
                  </div>
                </div>
                <button 
                  className="w-8 h-8 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-white/40 hover:text-white transition-all"
                  onClick={() => setIsOpen(false)}
                >
                  <ChevronDown size={18} />
                </button>
              </div>

              {/* Secure Transmission Ledger (Messages) */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-white/2">
                {messages.map((msg, idx) => (
                  <motion.div 
                    key={idx} 
                    initial={{ opacity: 0, x: msg.role === 'bot' ? -10 : 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                      msg.role === 'bot' 
                        ? 'bg-[#4f46e5]/10 border-[#4f46e5]/20 text-[#4f46e5]' 
                        : 'bg-white/5 border-white/10 text-white/40'
                    }`}>
                      {msg.role === 'bot' ? <Cpu size={14} /> : <User size={14} />}
                    </div>
                    <div className={`px-5 py-3.5 rounded-[1.25rem] text-[11px] font-bold leading-relaxed uppercase tracking-tight shadow-xl ${
                      msg.role === 'bot'
                        ? 'bg-white/5 border border-white/10 text-white/70 rounded-tl-none'
                        : 'bg-[#4f46e5] border border-white/10 text-white rounded-tr-none'
                    }`}>
                      {msg.content}
                    </div>
                  </motion.div>
                ))}
                
                {isLoading && (
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-lg bg-[#4f46e5]/10 border border-[#4f46e5]/20 flex items-center justify-center text-[#4f46e5] animate-pulse">
                      <Cpu size={14} />
                    </div>
                    <div className="px-6 py-4 rounded-[1.25rem] bg-white/5 border border-white/10 rounded-tl-none">
                       <div className="flex gap-2">
                          {[0, 1, 2].map(i => (
                             <motion.div 
                               key={i}
                               animate={{ opacity: [0.2, 1, 0.2] }}
                               transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                               className="w-1.5 h-1.5 rounded-full bg-[#4f46e5]"
                             />
                          ))}
                       </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Authorization Area */}
              <div className="p-6 border-t border-white/5 bg-white/2">
                <div className="relative group">
                   <textarea
                     className="w-full bg-white/5 border border-white/10 rounded-2xl pl-6 pr-14 py-4 text-[11px] font-bold text-white placeholder:text-white/20 outline-none focus:border-[#4f46e5]/30 transition-all resize-none max-h-32"
                     placeholder="Authorize request..."
                     value={inputValue}
                     onChange={(e) => setInputValue(e.target.value)}
                     onKeyDown={handleKeyPress}
                     rows={1}
                   />
                   <button 
                     className={`absolute right-3 bottom-3 w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                        !inputValue.trim() || isLoading 
                          ? 'bg-white/5 text-white/10 cursor-not-allowed' 
                          : 'bg-[#4f46e5] text-white hover:bg-opacity-90 shadow-glow'
                     }`}
                     onClick={handleSend}
                     disabled={isLoading || !inputValue.trim()}
                   >
                     <Send size={18} />
                   </button>
                </div>
                <div className="mt-4 flex items-center justify-between px-2">
                   <div className="flex items-center gap-2">
                      <Shield size={10} className="text-emerald-500/50" />
                      <span className="text-[8px] font-black uppercase tracking-widest text-white/20">End-to-End Encrypted</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <Zap size={10} className="text-blue-500/50" />
                      <span className="text-[8px] font-black uppercase tracking-widest text-white/20">Neural Engine v4.0</span>
                   </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1, rotate: isOpen ? 90 : 0 }}
        whileTap={{ scale: 0.9 }}
        className="w-16 h-16 rounded-[1.5rem] bg-[#4f46e5] text-white shadow-glow flex items-center justify-center border border-white/10 pointer-events-auto relative overflow-hidden group animate-neural-aura"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        {isOpen ? <X size={28} className="relative z-10" /> : <MessageCircle size={28} className="relative z-10" />}
      </motion.button>
    </div>
  )
}

export default KiraChat
