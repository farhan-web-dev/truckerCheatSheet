import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

// Optional: Use a modern clean font
// Font.register({
//   family: "Inter",
//   src: "https://fonts.gstatic.com/s/inter/v12/UcCO3H6mR6-AF1b0wCkVd9Y.woff2",
//   fonts: [
//     {
//       src: "https://fonts.gstatic.com/s/inter/v12/UcCO3H6mR6-AF1b0wCkVd9Y.woff2",
//     },
//   ],
// });

const styles = StyleSheet.create({
  page: {
    fontSize: 11,
    padding: 30,
    lineHeight: 1.5,
  },

  section: {
    marginBottom: 10,
  },
  heading: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
    borderBottom: "1px solid #000",
    paddingBottom: 2,
  },
  fieldGroup: {
    marginBottom: 6,
  },
  label: {
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 20,
  },
  column: {
    flexDirection: "column",
    flex: 1,
  },
});

interface BOLPreviewPDFProps {
  data: any;
}

export default function BOLPreviewPDF({ data }: BOLPreviewPDFProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.section}>
          <Text style={styles.heading}>Bill of Lading (BOL)</Text>
        </View>

        {/* BOL Info */}
        <View style={styles.section}>
          <Text>
            <Text style={styles.label}>BOL Number:</Text> {data.bolNumber}
          </Text>
          <Text>
            <Text style={styles.label}>Pickup Date:</Text> {data.pickupDate}
          </Text>
        </View>

        {/* Shipper and Consignee */}
        <View style={[styles.section, styles.row]}>
          <View style={styles.column}>
            <Text style={styles.heading}>Shipper</Text>
            {Object.entries(data.shipper).map(([key, val]) => (
              <Text key={key}>
                <Text style={styles.label}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}:{" "}
                </Text>
                {val}
              </Text>
            ))}
          </View>
          <View style={styles.column}>
            <Text style={styles.heading}>Consignee</Text>
            {Object.entries(data.consignee).map(([key, val]) => (
              <Text key={key}>
                <Text style={styles.label}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}:{" "}
                </Text>
                {val}
              </Text>
            ))}
          </View>
        </View>

        {/* Carrier Info */}
        <View style={styles.section}>
          <Text style={styles.heading}>Carrier</Text>
          <Text>
            <Text style={styles.label}>Carrier Name:</Text> {data.carrier.name}
          </Text>
          <Text>
            <Text style={styles.label}>Driver Name:</Text>{" "}
            {data.carrier.driverName}
          </Text>
          <Text>
            <Text style={styles.label}>Truck Number:</Text>{" "}
            {data.carrier.truckNumber}
          </Text>
          <Text>
            <Text style={styles.label}>Trailer Number:</Text>{" "}
            {data.carrier.trailerNumber}
          </Text>
        </View>

        {/* Shipment Details */}
        <View style={styles.section}>
          <Text style={styles.heading}>Shipment Details</Text>
          <Text>
            <Text style={styles.label}>Delivery Date:</Text>{" "}
            {data.shipment.deliveryDate}
          </Text>
          <Text>
            <Text style={styles.label}>Commodity:</Text>{" "}
            {data.shipment.commodity}
          </Text>
          <Text>
            <Text style={styles.label}>Description:</Text>{" "}
            {data.shipment.description}
          </Text>
          <Text>
            <Text style={styles.label}>Weight:</Text> {data.shipment.weight}
          </Text>
          <Text>
            <Text style={styles.label}>Pieces:</Text> {data.shipment.pieces}
          </Text>
          <Text>
            <Text style={styles.label}>Package Type:</Text>{" "}
            {data.shipment.packageType}
          </Text>
          <Text>
            <Text style={styles.label}>Hazmat:</Text>{" "}
            {data.shipment.hazmat ? "Yes" : "No"}
          </Text>
          <Text>
            <Text style={styles.label}>Special Instructions:</Text>{" "}
            {data.shipment.instructions}
          </Text>
        </View>

        {/* Charges */}
        <View style={styles.section}>
          <Text style={styles.heading}>Charges</Text>
          <Text>
            <Text style={styles.label}>Freight Charges:</Text> $
            {data.shipment.charges.freight}
          </Text>
          <Text>
            <Text style={styles.label}>Fuel Charges:</Text> $
            {data.shipment.charges.fuel}
          </Text>
          <Text>
            <Text style={styles.label}>Other Charges:</Text> $
            {data.shipment.charges.other}
          </Text>
        </View>
      </Page>
    </Document>
  );
}
