import pino from 'pino'

export default function logger() {
    return pino({
        level: 'info',
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true
          }
        },
      })
}