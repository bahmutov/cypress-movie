export default function ({ pauseMs }, commandFn, subject, ...args) {
  cy
    .wrap(subject)
    .trigger('mousemove')
    .wait(pauseMs)

    .trigger('click')
    .focus()

    .wait(500).then(() => {
      return commandFn(subject, ...args)
    })
}
