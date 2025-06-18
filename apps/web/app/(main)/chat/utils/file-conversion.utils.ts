export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("FileReader did not return a string"));
      }
    };
    reader.onerror = (error) => reject(error);
  });
}

export function base64ToUint8Array(base64: string): Uint8Array {
  const base64Data = base64.includes(",")
    ? base64.split(",")[1] || base64
    : base64;

  const binary = atob(base64Data);
  const uint8Array = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    uint8Array[i] = binary.charCodeAt(i);
  }

  return uint8Array;
}
