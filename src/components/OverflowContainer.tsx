import { Key, ReactNode, useLayoutEffect, useRef, useState } from "react"



type OverflowContainerProps<T> = {
  className?: string
  items: T[]
  renderItem: (item: T) => ReactNode
  renderOverflow: (overflowAmount: number) => ReactNode
  getKey: (item: T) => Key

}

export function OverflowContainer<T>({ className, items, renderItem, renderOverflow, getKey}: OverflowContainerProps<T>) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [overflowAmount, setOverflowAmount] = useState(0)

  useLayoutEffect(() => {
    if (containerRef.current == null) return

    const resizeObserver = new ResizeObserver((entries) => {
      const containerElement = entries[0]?.target
      if (containerElement == null) return

      const eventChildren = containerElement.querySelectorAll<HTMLElement>("[data-item]")
      const overflowElement = containerElement.parentElement?.querySelector<HTMLElement>("[data-overflow]")

      if (overflowElement != null) overflowElement.style.display = "none"
      eventChildren.forEach((child) => child.style.removeProperty("display"))

      let amount = 0;
      for (let i = eventChildren.length - 1; i >= 0; i--) {
        const child = eventChildren[i]

        if (containerElement.scrollHeight <= containerElement.clientHeight) {
          break
        }

        amount = eventChildren.length - i
        child.style.display = "none"
        overflowElement?.style.removeProperty("display")

        setOverflowAmount(amount)
      }
    })

    resizeObserver.observe(containerRef.current)

    return (() => resizeObserver.disconnect())
  }, [items])



  return (
    <>
      <div className={className} ref={containerRef}>
        {items.map((item) => {
          return (
            <div data-item key={getKey(item)}>
              {renderItem(item)}
            </div>
          )
        })}
      </div>
      
      <div data-overflow>
        {renderOverflow(overflowAmount)}
      </div>
    </>
  )
}