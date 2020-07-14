export default function ({ pauseMs }, commandFn, ...args) {
  return commandFn(...args).then((subject) => {
    return Cypress.Promise.resolve(subject).delay(pauseMs)
  })
}
