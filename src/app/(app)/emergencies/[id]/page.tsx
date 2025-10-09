export default function EmergencyDetailPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1 className="text-3xl font-bold">Emergency Details: {params.id}</h1>
      <p className="text-muted-foreground">This page is under construction.</p>
    </div>
  );
}
