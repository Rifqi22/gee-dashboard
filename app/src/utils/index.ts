export const generateMonthOptions = (start: string, end: string): string[] => {
  const startDate = new Date(start + "-01");
  const endDate = new Date(end + "-01");
  const options: string[] = [];

  while (startDate <= endDate) {
    const year = startDate.getFullYear();
    const month = String(startDate.getMonth() + 1).padStart(2, "0");
    options.push(`${year}-${month}`);
    startDate.setMonth(startDate.getMonth() + 1);
  }

  return options;
};