export default function ({ pauseMs }, commandFn, subject, ...args) {
  return cy
    .wrap(subject)
    .trigger('mousemove')
    .wait(pauseMs).then(() => {
      return commandFn(subject, ...args)
    })
}
