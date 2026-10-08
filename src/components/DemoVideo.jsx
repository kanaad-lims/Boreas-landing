/** Responsive project demo video. */
export default function DemoVideo() {
  return (
    <section className="sec demo-video" aria-label="Project demonstration">
      <div className="demo-video__frame">
        <video
          className="demo-video__player"
          controls
          playsInline
          preload="metadata"
          aria-label="NEXUS-AGENT project demonstration"
        >
          <source src="/videos/paperlens_video.mp4" type="video/mp4" />
        </video>
      </div>
    </section>
  )
}
