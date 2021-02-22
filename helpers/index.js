export const isMobile = () => {
  let isMobile = false;
  if (typeof window !== "undefined") {
    isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  }
  return isMobile
}