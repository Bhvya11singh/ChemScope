function StatisticsCard({
  title,
  value
}) {
  return (
    <div className="property-card">
      <h5>{title}</h5>
      <h3>{value}</h3>
    </div>
  );
}

export default StatisticsCard;