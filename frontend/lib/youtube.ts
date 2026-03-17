export function getYouTubeEmbedUrl(url: string) {

    if (!url) return "";
  
    if (url.includes("watch?v=")) {
      return url.replace("watch?v=", "embed/");
    }
  
    if (url.includes("youtu.be/")) {
      const id = url.split("youtu.be/")[1];
      return `https://www.youtube.com/embed/${id}`;
    }
  
    return url;
  }