/** Responsive project demo GIF. */
export default function DemoVideo() {
  return (
    <section className="sec demo-video" aria-label="Project demonstration">
      <div className="demo-video__frame">
        <img
          className="demo-video__player"
          src="/videos/gif_harness.gif"
          alt="BOREAS-AGENT project demonstration"
          loading="lazy"
        />
      </div>
    </section>
  )
}
