export default function GridTextSettings({
  containerText,
  setContainerText,
}) {
  return (
    <div className="card section">
      <h4>Grid + Texto</h4>

      <input
        placeholder="Título"
        value={containerText.title.text}
        onChange={(e) =>
          setContainerText((prev) => ({
            ...prev,
            title: { ...prev.title, text: e.target.value },
          }))
        }
      />

      <input
        placeholder="Subtítulo"
        value={containerText.subtitle.text}
        onChange={(e) =>
          setContainerText((prev) => ({
            ...prev,
            subtitle: { ...prev.subtitle, text: e.target.value },
          }))
        }
      />

      <textarea
        placeholder="Descripción"
        value={containerText.paragraph.text}
        onChange={(e) =>
          setContainerText((prev) => ({
            ...prev,
            paragraph: { ...prev.paragraph, text: e.target.value },
          }))
        }
      />
    </div>
  );
}