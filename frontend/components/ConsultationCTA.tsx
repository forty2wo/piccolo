'use client';

import { useState, useEffect, FormEvent, ChangeEvent } from 'react';

interface ConsultationData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const STORAGE_KEY = 'piccola-consultation-history';

export default function ConsultationCTA() {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<ConsultationData>({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  // ESC 关闭
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  // 锁定 body 滚动
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // TODO: 接入后端 API
      // 当前阶段：写到 localStorage，方便销售跟进
      const history = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      history.push({ ...formData, submittedAt: new Date().toISOString() });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
      console.log('[ConsultationCTA] 提交:', formData);
      await new Promise(resolve => setTimeout(resolve, 400));
      setSubmitted(true);
    } catch (err) {
      console.error('Submit error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    // 关闭后 1.5s 重置成功态，方便二次提交
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', phone: '', message: '' });
    }, 300);
  };

  return (
    <>
      {/* 触发按钮：PC 端右下角悬浮 / 移动端底部横条（同一组件的响应式呈现，不算重复）。 */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed z-40
                     bottom-4 right-4 md:bottom-6 md:right-6
                     hidden md:flex
                     items-center gap-2
                     px-5 py-3
                     bg-primary text-white
                     text-xs tracking-[0.15em] uppercase
                     shadow-lg
                     hover:bg-warm-text
                     transition-colors duration-300
                     border border-primary"
          aria-label="联系顾问"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
          </svg>
          联系顾问
        </button>
      )}

      {/* 移动端底部固定横条 */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed z-40 bottom-0 left-0 right-0 md:hidden
                     bg-primary text-white
                     py-3 px-6
                     text-sm tracking-[0.1em]
                     flex items-center justify-center gap-2
                     shadow-[0_-2px_10px_rgba(0,0,0,0.1)]
                     active:bg-warm-text"
          aria-label="联系顾问"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
          </svg>
          联系顾问
        </button>
      )}

      {/* 弹窗 */}
      {open && (
        <>
          {/* 背景遮罩 */}
          <div
            className="fixed inset-0 z-50 bg-black/50 transition-opacity"
            onClick={handleClose}
            aria-hidden="true"
          />

          {/* 表单容器 */}
          <div
            className="fixed z-50
                       inset-x-0 bottom-0 md:inset-auto md:right-6 md:bottom-6
                       md:max-w-md md:w-full
                       bg-white shadow-2xl
                       max-h-[90vh] overflow-y-auto
                       animate-in fade-in slide-in-from-bottom-4 duration-300"
            role="dialog"
            aria-modal="true"
            aria-labelledby="consultation-title"
          >
            {/* Header */}
            <div className="flex items-start justify-between p-6 border-b border-border">
              <div>
                <p className="text-[10px] tracking-[0.2em] uppercase text-accent mb-1">
                  Get in Touch
                </p>
                <h2 id="consultation-title" className="text-lg font-display font-bold text-primary">
                  联系顾问
                </h2>
                <p className="text-xs text-primary-light mt-1">
                  留下信息，48 小时内回复
                </p>
              </div>
              <button
                onClick={handleClose}
                className="p-1 text-primary-light hover:text-primary transition-colors"
                aria-label="关闭"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 mx-auto mb-4 border-2 border-primary rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <h3 className="text-base font-medium text-primary mb-2">
                    收到您的预约
                  </h3>
                  <p className="text-sm text-primary-light mb-6">
                    我们将在 48 小时内与您联系
                  </p>
                  <button
                    onClick={handleClose}
                    className="text-xs tracking-[0.15em] uppercase text-primary border-b border-primary pb-0.5 hover:opacity-70 transition-opacity"
                  >
                    继续浏览
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-primary mb-1.5">
                      姓名 <span className="text-primary-muted">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 border border-border text-sm
                                 focus:outline-none focus:border-primary
                                 transition-colors"
                      placeholder="您的姓名"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-primary mb-1.5">
                      邮箱 <span className="text-primary-muted">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 border border-border text-sm
                                 focus:outline-none focus:border-primary
                                 transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-primary mb-1.5">
                      电话
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 border border-border text-sm
                                 focus:outline-none focus:border-primary
                                 transition-colors"
                      placeholder="+86 ..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-primary mb-1.5">
                      项目简述
                    </label>
                    <textarea
                      name="message"
                      rows={3}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 border border-border text-sm resize-none
                                 focus:outline-none focus:border-primary
                                 transition-colors"
                      placeholder="空间类型 / 面积 / 风格偏好..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 mt-2
                               bg-primary text-white text-xs tracking-[0.15em] uppercase
                               hover:bg-primary-light
                               transition-colors duration-300
                               disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? '提交中...' : '提交预约'}
                  </button>

                  <p className="text-[10px] text-primary-muted text-center mt-3 leading-relaxed">
                    提交即同意我们联系您。<br />
                    您的信息仅用于本次咨询，不会用于其他用途。
                  </p>
                </form>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
