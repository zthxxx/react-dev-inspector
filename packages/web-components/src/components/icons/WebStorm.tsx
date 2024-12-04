export const WebStorm = (props: {
  size?: string | number;
  class?: string;
}) => {
  return (
    <img
      width={props.size}
      height={props.size}
      class={props.class}
      src={`data:image/svg+xml;base64,${logo}`}
    />
  )
}

const logo = window.btoa(`
  <svg viewBox="0 0 256 256" version="1.1" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="a" x1="43.9%" x2="66.2%" y1="2%" y2="95.2%">
        <stop offset="28%" stop-color="#07C3F2" />
        <stop offset="94%" stop-color="#087CFA" />
      </linearGradient>
      <linearGradient id="b" x1="33.1%" x2="70.4%" y1="15.1%" y2="84.7%">
        <stop offset="14%" stop-color="#FCF84A" />
        <stop offset="37%" stop-color="#07C3F2" />
      </linearGradient>
      <linearGradient id="c" x1="44.4%" x2="56.2%" y1="25.1%" y2="90.2%">
        <stop offset="28%" stop-color="#07C3F2" />
        <stop offset="94%" stop-color="#087CFA" />
      </linearGradient>
    </defs>
    <path fill="url(#a)" d="M34.5 231.4 0 26.8 63.8.3l40.8 24.3 37.3-20.2 77.8 29.9L176.1 256z" />
    <path fill="url(#b)" d="M256 86.7 223 5.1 163 0 70.5 88.9l24.9 114.6 46.5 32.6L256 168.4l-28-52.5z" />
    <path fill="url(#c)" d="m204.7 74.5 23.3 41.4 28-29.2-20.6-50.8z" />
    <path d="M48 48h160v160H48z" />
    <path fill="#FFF" d="M68 177.8h60v10H68zm56.7-109.9-8.9 35-10.2-35H95.4l-10.2 35-9-35h-14l17.2 60h11.3l9.8-34.7 9.7 34.7h11.4l17.1-60zm16.5 51.7 7.8-9.6c5 4.6 11.3 7.2 18 7.3 5.3 0 8.7-2.1 8.7-5.6v-.2c0-2-.7-3.3-3-4.6l-.4-.2-.4-.2h-.3l-.4-.3h-.3l-.5-.3-.5-.2h-.3l-.5-.3h-.3l-.7-.3-.6-.2h-.4l-.7-.3-.8-.2-.8-.2-.8-.2-1.6-.5-1.1-.3-.8-.2-.7-.2-.7-.2-.8-.2-.6-.2-.7-.3h-.4l-.6-.3-.7-.3-.6-.2-.6-.3h-.3l-.6-.4-.6-.2a15 15 0 0 1-9-14.4v-.5c0-10.8 8.6-18 20.7-18.2h.4c8.1-.1 16 2.6 22.3 7.7l-6.8 10c-4.5-3.6-10-5.6-15.7-6-5 0-7.7 2.3-7.7 5.4v.1c0 2.4 1 3.9 4 5.3l.5.2.5.2.5.2.6.2.6.2.6.1.6.3.7.2 1 .3.8.2.8.2 1.8.4.8.3.8.2.4.1.8.3.8.2.8.2.7.3.8.3h.3l.7.4c7.7 3 12 7.4 12.2 15.5v.5c0 12-9.2 18.7-22.2 18.7-9.4 0-18.4-3.4-25.5-9.7" />
  </svg>
`)
