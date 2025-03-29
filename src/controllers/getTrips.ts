export const getTripsHandler = async (c) => {
  const trips = { message: 'test' };

  return c.json({ data: trips, status: 200 });
};
