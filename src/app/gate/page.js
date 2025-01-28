import ButtonSlider from "./gate";
const HomePage = () => {
  const imageArray = ["/iit-ropar-5.avif", "/iit-ropar-4.avif","/iit-ropar-2.jpg", "/iit-ropar-1.jpg"];
  return (
    <div>
      <ButtonSlider images={imageArray} />
    </div>
  );
};

export default HomePage;
