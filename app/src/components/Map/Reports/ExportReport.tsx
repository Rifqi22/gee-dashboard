import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface SummaryItem {
  layer: string;
  min: number;
  max: number;
  mean?: number;
  unit?: string;
}

interface ExportOptions {
  summary: SummaryItem[];
  mapContainerId: string;
  chartRef: React.RefObject<HTMLDivElement>;
}

export async function exportReport({
  summary,
  mapContainerId,
  chartRef,
}: ExportOptions) {
  const doc = new jsPDF();

  // Patch unsupported oklch() colors
  function patchUnsupportedColors(root: HTMLElement) {
    const elements = root.querySelectorAll("*");

    elements.forEach((el) => {
      const style = getComputedStyle(el);
      ["color", "backgroundColor", "borderColor"].forEach((prop) => {
        const value = style[prop as keyof CSSStyleDeclaration];
        if (value?.includes("oklch")) {
          (el as HTMLElement).style[prop as any] = "#000"; // fallback
        }
      });
    });
  }

  // Title
  doc.setFontSize(16);
  doc.text("Dashboard Report", 14, 20);

  // Summary Table
  doc.setFontSize(12);
  doc.text("Summary Statistics:", 14, 30);

  const tableStartY = 35;
  summary.forEach((s, i) => {
    const line = `${s.layer}: Min = ${s.min.toFixed(2)}, Max = ${s.max.toFixed(
      2
    )}${s.unit ? ` ${s.unit}` : ""}`;
    doc.text(line, 14, tableStartY + i * 7);
  });

  // Capture chart
  if (chartRef.current) {
    patchUnsupportedColors(chartRef.current);
    try {
      const chartCanvas = await html2canvas(chartRef.current);
      const chartImg = chartCanvas.toDataURL("image/png");
      doc.addImage(
        chartImg,
        "PNG",
        14,
        tableStartY + summary.length * 7 + 10,
        180,
        60
      );
    } catch (err) {
      console.error("Chart capture failed:", err);
    }
  }

  // Capture map
  //   const mapEl = document.getElementById(mapContainerId);
  //   if (mapEl) {
  //     patchUnsupportedColors(mapEl);
  //     try {
  //       const mapCanvas = await html2canvas(mapEl);
  //       const mapImg = mapCanvas.toDataURL("image/png");
  //       doc.addPage();
  //       doc.setFontSize(14);
  //       doc.text("Map Snapshot", 14, 20);
  //       doc.addImage(mapImg, "PNG", 14, 30, 180, 120);
  //     } catch (err) {
  //       console.error("Map capture failed:", err);
  //     }
  //   }

  // Save PDF
  doc.save("dashboard_report.pdf");
}
