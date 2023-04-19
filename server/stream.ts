import type {
  ParsedEvent,
  ReconnectInterval,
} from 'eventsource-parser'
import { createParser } from 'eventsource-parser'
import { requestOpenai } from './mock'
import { Response } from 'express'

export async function createStream(res: Response) {
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
        console.log('onParse', event)
        if (event.type === 'event') {
          const data = event.data
          if (data === 'end') {
            controller.close()
            res.end()
            return
          }
          try {
            const queue = encoder.encode('text' || '')
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
      for await (const chunk of openaiRes as any){
        console.log('aaa',chunk)
        parser.feed(decoder.decode(chunk, { stream: true }))
      }
    },
  })

  return stream
}
