import QrCodeWhatsapp from "@/components/QrCodeWhatsapp";

export default async function SettingsPage() {
  const data = await fetch(process.env.WHATSAPP_API_URL + '/is-connected', {
    cache: 'no-cache',
  }).then(response => response.json())

  return (
    <>
      <h1>Settings</h1>
      {
        data.connected &&
        <h2>Connected</h2>
      }
      {
        !data.connected &&
        <QrCodeWhatsapp />
      }
    </>
  );
}