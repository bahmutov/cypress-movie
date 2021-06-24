export default function ({ pauseMs }, commandFn, subject, ...args) {
  cy
    .wrap(subject)
    .trigger('mousemove')
    .wait(pauseMs)

    .trigger('click', {
      scrollBehavior: false
    })
    .focus()

    .wait(500).then(() => {
      return commandFn(subject, ...args, {
        delay: 50,
        scrollBehavior: false
      })
    })
}
