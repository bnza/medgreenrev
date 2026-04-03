export default function () {
  const { addError, addSuccess } = useMessagesStore()
  return function (value: string) {
    {
      if (!navigator.clipboard) {
        addError("Browser don't have support for native clipboard.")
        return
      }
      navigator.clipboard
        .writeText(value)
        .then(() => {
          addSuccess('Copied!')
        })
        .catch((error) => {
          addError(
            `Your browser doesn't support copy to clipboard command. Please do it manually. ${error.message}`,
          )
        })
    }
  }
}
