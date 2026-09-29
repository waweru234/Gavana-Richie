'use client'

export function AskMeButton() {
  return (
    <button
      type="button"
      className="button button-primary home-ask-button"
      aria-haspopup="dialog"
      aria-controls="campaign-help-dialog"
      onClick={() => window.dispatchEvent(new Event('nakuru:open-campaign-assistant'))}
    >
      Ask a question <span aria-hidden="true">↗</span>
    </button>
  )
}
