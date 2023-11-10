import { sleep } from "@/utils"

export class Launcher {
  private queue: HTMLDivElement
  constructor(parentElement: HTMLElement = document.body) {
    this.queue = document.createElement("div")
    this.queue.className = `na-message-queue`
    parentElement.append(this.queue)
  }
  async emit(detail: string | {
    content?: string
    primary?: "success" | "danger" | "warning" | "primary"
    duration?: number
  }) {
    const msg = document.createElement("div")
    let duration: number = 2000
    let primary: string = ""
    let content = detail ?? "☘"
    if (typeof content != 'string') {
      duration = content.duration ?? 2000
      primary = `${content.primary ?? ""}`
      content = `${content.content ?? "☘"}`
    }
    msg.innerHTML = `
      <div class="na-message">
        <p class="na-paragraph">${content}</p>
      </div>
    `
    if (primary) {
      (msg.firstElementChild as HTMLDivElement).dataset.primary = primary
    }
    this.queue.appendChild(msg)
    msg.style.height = `${msg.offsetHeight}px`
    msg.style.transition = "opacity 1s, height 2s"
    await sleep(duration)
    msg.style.opacity = '0'
    msg.style.height = '0'
    await sleep(2000) // 2000对应 transition height 2s
    this.queue.removeChild(msg)
  }
}

const body = new Launcher

export default (...args: Parameters<typeof body.emit>) => body.emit(...args)
