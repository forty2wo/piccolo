import Image, { type ImageProps } from 'next/image'

interface Props extends ImageProps {
  duration?: number
}

/**
 * FadeImage — 图片渐入加载效果
 * 使用 CSS keyframes 动画，不依赖 React state / onLoad
 * 避免 SSR 水合时序问题
 */
export default function FadeImage({ duration = 600, className = '', ...props }: Props) {
  return (
    <Image
      {...props}
      className={`fade-image-in ${className}`}
      style={{
        ...props.style,
        animationDuration: `${duration}ms`,
      }}
    />
  )
}
