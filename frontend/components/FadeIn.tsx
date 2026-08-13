'use client'

import { useEffect, useRef, useState, ReactNode } from 'react'

interface FadeInProps {
  children: ReactNode
  /** 延迟时间（毫秒），用于错峰出现 */
  delay?: number
  /** 向上偏移距离（px） */
  offset?: number
  /** 动画时长（毫秒） */
  duration?: number
  /** 触发阈值（0-1，元素露出多少比例时触发） */
  threshold?: number
  /** 额外 className */
  className?: string
  /** 标签名，默认 div */
  as?: keyof JSX.IntrinsicElements
  /** 只触发一次（默认 true） */
  once?: boolean
}

/**
 * 滚动显现动画组件 — 参照 41zero42 的效果
 * 元素进入视口时，从下方缓缓升起 + 淡入
 *
 * 使用 IntersectionObserver API，性能最优
 *
 * ⚠️ 注意：动画结束后 transform 设为 none（不是 translateY(0)），
 * 避免创建 CSS containing block 影响子孙元素的 fixed 定位
 */
export default function FadeIn({
  children,
  delay = 0,
  offset = 60,
  duration = 900,
  threshold = 0.1,
  className = '',
  as = 'div',
  once = true,
}: FadeInProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [animationDone, setAnimationDone] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // 如果已经在视口里了（首屏元素），延迟一点再触发
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      const timer = setTimeout(() => setIsVisible(true), 50 + delay)
      return () => clearTimeout(timer)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            if (once) {
              observer.unobserve(entry.target)
            }
          } else if (!once) {
            setIsVisible(false)
            setAnimationDone(false)
          }
        })
      },
      {
        threshold,
        rootMargin: '0px 0px -50px 0px',
      }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [delay, threshold, once])

  // 动画结束后标记，清除 transform（避免影响内部 fixed 定位）
  useEffect(() => {
    if (!isVisible) return
    const timer = setTimeout(() => setAnimationDone(true), duration + delay + 50)
    return () => clearTimeout(timer)
  }, [isVisible, duration, delay])

  const Tag = as as any

  const style: React.CSSProperties = animationDone
    ? { opacity: 1, transform: 'none' }  // 动画结束后清除 transform，避免创建 containing block
    : {
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : `translateY(${offset}px)`,
        transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
      }

  return (
    <Tag ref={ref} className={className} style={style}>
      {children}
    </Tag>
  )
}
