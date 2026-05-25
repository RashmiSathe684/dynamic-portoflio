import { useState } from 'react';
import { sendContactMessage } from '../../../api/services';

export default function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await sendContactMessage(form);
      setSent(true);
      setForm({ name: '', email: '', message: '' });
      setTimeout(() => setSent(false), 5000);
    } catch (err) {
      console.error(err);
      alert('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="section py-20 px-6 md:px-20 relative z-10 transition-colors duration-500">
      <div className="eyebrow block text-[11px] font-bold uppercase tracking-[2.5px] text-accent mb-2">
        Contact
      </div>
      <h2 className="sec-title font-[Space Grotesk] text-[clamp(26px,3vw,40px)] font-bold tracking-[-1px] text-text-main mb-10">
        Connect With Me
      </h2>

      <div className="contact-grid grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-12 items-start">
        {/* Left Column Direct Info */}
        <div className="select-text">
          <div className="contact-title font-[Space Grotesk] text-[clamp(32px,3.5vw,48px)] font-bold leading-[1.05] tracking-[-2.5px] text-text-main mb-4">
            Have an opportunity? <br />
            <span className="grad bg-clip-text text-transparent bg-gradient-to-r from-accent to-cyan font-bold">
              I'd love to hear from you.
            </span>
          </div>
          
          <p className="contact-p text-[14px] text-brand-gray leading-[1.75] mb-8 max-w-[380px]">
            I'm currently looking for new opportunities and my inbox is always open. Whether you have a question or just want to say hi, I'll try my best to get back to you!
          </p>
          
          {/* Social cards with distinct colored icon backgrounds */}
          <div className="flex flex-col select-none">
            <a href="mailto:rashmisathe684@gmail.com" className="clink">
              <div 
                className="clink-ico" 
                style={{ color: '#EF4444', background: 'rgba(239, 68, 68, 0.12)' }}
              >
                ✉
              </div>
              <div>
                <div className="clink-lbl">Email</div>
                <div className="clink-val select-all">rashmisathe684@gmail.com</div>
              </div>
            </a>
            
            <a href="https://linkedin.com/in/rashmisathe" target="_blank" rel="noreferrer" className="clink">
              <div 
                className="clink-ico font-bold text-[15px]" 
                style={{ color: '#3B82F6', background: 'rgba(59, 130, 246, 0.12)' }}
              >
                in
              </div>
              <div>
                <div className="clink-lbl">LinkedIn</div>
                <div className="clink-val">rashmisathe</div>
              </div>
            </a>
            
            <a href="https://github.com/RashmiSathe684" target="_blank" rel="noreferrer" className="clink">
              <div 
                className="clink-ico font-semibold text-[19px]" 
                style={{ color: '#4B5563', background: 'rgba(75, 85, 99, 0.12)' }}
              >
                ⌥
              </div>
              <div>
                <div className="clink-lbl">GitHub</div>
                <div className="clink-val">RashmiSathe684</div>
              </div>
            </a>
            
            <a href="https://leetcode.com/u/rashmi684" target="_blank" rel="noreferrer" className="clink">
              <div 
                className="clink-ico text-[16px]" 
                style={{ color: '#F59E0B', background: 'rgba(245, 158, 11, 0.12)' }}
              >
                ◈
              </div>
              <div>
                <div className="clink-lbl">LeetCode</div>
                <div className="clink-val">rashmi684</div>
              </div>
            </a>
          </div>
        </div>

        {/* Right Column Form Card */}
        <div className="form-card select-none">
          <div className="form-title">Send a Message</div>
          <form onSubmit={handleSubmit}>
            <label className="flbl">FULL NAME</label>
            <input 
              type="text" 
              placeholder="Enter your full name" 
              className="finp select-text" 
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required 
            />
            
            <label className="flbl">EMAIL ADDRESS</label>
            <input 
              type="email" 
              placeholder="Enter your email address" 
              className="finp select-text" 
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required 
            />
            
            <label className="flbl">YOUR MESSAGE</label>
            <textarea 
              placeholder="Type your message here..." 
              className="finp tall select-text" 
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              required
            />
            
            <button 
              type="submit" 
              disabled={loading}
              className="fbtn cursor-pointer"
            >
              {loading 
                ? 'Sending...' 
                : sent 
                  ? 'Message Sent Successfully! 🗸' 
                  : 'Send Message ✉'
              }
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
