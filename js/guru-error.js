//
// Silly module to show a guru meditation style error message
// Ben Coleman, 2023
// MIT License
//

const errorTemplate = `
<div class="guru-error">
  Software Failure.<br>Guru Meditation. {{error}}
</div>
`

export function showGuru(err, replaceBody = true, stack = false) {
  let errString = err.toString()

  console.error(err)

  if (err.message) {
    errString = err.message
  } else if (typeof err === 'object') {
    errString = JSON.stringify(err, null, 2)
  }

  if (stack && err.stack) {
    errString = err.stack
  }

  if (replaceBody) {
    document.body.style.backgroundColor = '#000'
    document.body.parentElement.style.backgroundColor = '#000'
    document.body.innerHTML = ''
  }

  const errDiv = document.createElement('div')
  errDiv.innerHTML = errorTemplate.replace('{{error}}', errString)
  document.body.appendChild(errDiv)
}

// Append styles to page
const style = document.createElement('style')
style.innerHTML = `
@import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');

.guru-error {
  font-family: 'VT323';
  color: #ff0000;
  text-align: center;
  border: 10px solid #ff0000;
  background-color: #000;
  padding: 1.5rem;
  font-size: 38px;
  animation: blink 2s steps(1, end) infinite;
}

@keyframes blink {
  0% {
    border-color: #000;
  }
  50% {
    border-color: #ff0000;
  }
}
`
document.head.appendChild(style)
