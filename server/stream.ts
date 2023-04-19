import type {
  ParsedEvent,
  ReconnectInterval,
} from 'eventsource-parser'
import { createParser } from 'eventsource-parser'
import { requestOpenai } from './mock'

export async function createStream(res) {
  const encoder = new TextEncoder()
  const decoder = new TextDecoder()

  const openaiRes = await requestOpenai()

  // 设置响应头
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  const stream = new ReadableStream({
    async start(controller) {
      function onParse(event: ParsedEvent | ReconnectInterval) {
        if (event.type === 'event') {
          const data = event.data

          try {
            const { text, end } = adapter(data, 'openai')
            if (end) {
              controller.close()
              res.end()
              return
            }
            const queue = encoder.encode(text || '')
            res.write(queue)
            controller.enqueue(queue)
          }
          catch (e) {
            controller.error(e)
            console.error('createStream error', e)
          }
        }
      }

      const parser = createParser(onParse)
      for await (const chunk of openaiRes.body)
        parser.feed(decoder.decode(chunk, { stream: true }))
    },
  })

  return stream
}
