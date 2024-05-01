AOS.init();

//  Work experience cards

const experiencecards = document.querySelector(".experience-cards");
const exp = [
  {
    title: "Wireless Research Intern",
    cardImage: "assets/images/experience-page/ipt.png",
    place: "Information Processing and Transmission Lab",
    time: "(May, 2023 - present)",
    desp: "<li>Published 4 conference papers @ IEEE Globecom and 1 Journal @ IEEE Communication Letters.</li> <li>Developed an open-source python pakcage 'Comyx' for 6G Communications.</li> <li>Developed novel systems models and performed Mathemcatical analysis and deep reinforcement learning optimzation to enhance system performance.</li>",
  },
  {
    title: "Machine Learning Intern",
    cardImage: "assets/images/experience-page/Carleton.jpg",
    place: "School of Information Technology, Carleton University",
    time: "(Mar - Aug, 2023)",
    desp: "<li> Proposed Zero-Shot Learning (ZSL) and Self-Attention GANs for ZSL tasks.</li> <li>Demonstrated SAGAN’s superior performance over GAN in ZSL, through self-attention mechanisms and reduced model collapses.</li> <li>Published a conference paper @ IEEE FIT 2023.</li>",
  },
  {
    title: "Deep Learning Intern",
    cardImage: "assets/images/experience-page/TUKL.png",
    place: "TUKL, Deep Learning Research and Development Lab, NUST",
    time: "(June, 2021 - September, 2023)",
    desp: "<li>Implemented a multi-stage pipeline for systematically extracting and interpreting tabular structures in image-based documents.</li> <li>Proposed advanced image transformer architecture and novel data augmentation, enhancing results to beat state-of-the-art models.</li>  Improved the efficiency of the previously proposed tabular augmentation model.</li>",
  },
  {
    title: "Machine Learning Intern",
    cardImage: "assets/images/experience-page/machvis.png",
    place: "Machine Vision and Intelligent Systems Lab, NUST",
    time: "(June, 2022 - September, 2022)",
    desp: "<li> Annotated dataset of 6000 images featuring oriented and conventional bounding boxes.</li> <li>  Devised a robust architecture and algorithm to discern object orientations accurately, generating corresponding bounding boxes aligned with the detected angles.</li>",
  },
];

const showCards2 = () => {
  let output = "";
  exp.forEach(
    ({ title, cardImage, place, time, desp }) =>
      (output += `        
    <div class="col gaap" data-aos="fade-up" data-aos-easing="linear" data-aos-delay="100" data-aos-duration="400"> 
      <div class="card card1">
        <img src="${cardImage}" class="featured-image"/>
        <article class="card-body">
          <header>
            <div class="title">
              <h3>${title}</h3>
            </div>
            <p class="meta">
              <span class="pre-heading">${place}</span><br>
              <span class="author">${time}</span>
            </p>
            <ol>
              ${desp}
            </ol>
          </header>
        </article>
      </div>
    </div>
      `)
  );
  experiencecards.innerHTML = output;
};
document.addEventListener("DOMContentLoaded", showCards2);

// Volunteership Cards

const volunteership = document.querySelector(".volunteership");
const volunteershipcards = [
  {
    title: "GradCompass",
    cardImage: "assets/images/experience-page/gradcompass.png",
    description:
      "Founder and the CEO of GradCompass. GradCompass is a platform that helps students in their university applications by providing them with the best resources and guidance.",
  },
  {
    title: "Google Students Developer Club",
    cardImage: "assets/images/experience-page/GSDC.png",
    description:
      "I was a part of the core team of GSDC, where I was responsible for managing the technical and non-technical events and workshops.",
  },
  {
    title: "Executive Member @ IEEE,NUST",
    cardImage: "/assets/images/experience-page/nustieeeclub_logo.jpg",
    description:
      "Executive Member @ IEEE NUST - media team, responsible for photography and event management for all IEEE event @ NUST. .",
  },
  {
    title: "Director @ Youth Entrapreneur Society",
    cardImage: "assets/images/experience-page/YES.png",
    description:
      "Member and Director of YES Society @ NUST. My responsibilites included organizing events, and seminars for students.",
  },
];

const showCards = () => {
  let output = "";
  volunteershipcards.forEach(
    ({ title, cardImage, description }) =>
      (output += `        
      <div class="card volunteerCard" data-aos="fade-down" data-aos-easing="linear" data-aos-delay="100" data-aos-duration="600" style="height: 550px;width:400px">
      
      <img src="${cardImage}" height="250" width="65" class="card-img" style="border-radius:10px">
      <div class="content">
          <h2 class="volunteerTitle">${title}</h2><br>
          <p class="copy">${description}</p></div>
      
      </div>
      `)
  );
  volunteership.innerHTML = output;
};
document.addEventListener("DOMContentLoaded", showCards);

// Hackathon Section

const hackathonsection = document.querySelector(".hackathon-section");
const mentor = [
  {
    title: "Stanford Graduate Fellowship",
    subtitle: "Scholarship",
    image: "assets/images/experience-page/Stanford.jpg",
    desp: "Awarded the Stanford Graduate Fellowship (SGF) for the academic year 2024-2025. The SGF is a prestigious fellowship that provides full tuition and stipend to the top the admitted students.",
    href: "https://vpge.stanford.edu/fellowships-funding/sgf/",
  },
  {
    title: "President's Medal",
    subtitle: "Third Position HSSC Nationwide",
    image: "assets/images/experience-page/board.jpeg",
    desp: " Awarded President's Medal, a laptop and 2 lac Pkr for obtaining 3rd position pre-engineering group nationwide.",
    href: "https://www.facebook.com/Federal.BISE.Official/photos/a.516769331679139/3274011435954901/?type=3",
  },
  {
    title: "Merit Scholarship @ NUST",
    subtitle: "GPA-Based Scholarship",
    image: "assets/images/experience-page/NUST.jpg",
    desp: "GPA-based scholarship @ NUST for achieving 3.9+ pointers in 2021-2024.",
    href: "https://nust.edu.pk/",
  },
  {
    title: "Top-10 STEP, ECAT",
    subtitle: "Top 10 in ECAT, Engineering Test nationwide",
    image: "assets/images/experience-page/step.png",
    desp: "Elevate Hacks is an upcoming all-female virtual hackathon coming from AUGUST 14th to 15th.",
    href: "https://step.pgc.edu/",
  },
  {
    title: "World Wide Fund for Nature",
    subtitle: "Community Service",
    image: "assets/images/experience-page/WWF.jpg",
    desp: "WWF is an international non-governmental organization working in the field of the wilderness preservation, and the reduction of human impact on the environment.",
    href: "https://www.worldwildlife.org/",
  },
  {
    title: "Al-AKhuwat Foundation",
    subtitle: "Community Service",
    image: "assets/images/experience-page/akhuwat.jpg",
    desp: "Community service at Al-Akhuwat Foundation, a non-profit organization that provides interest-free loans to the needy.",
    href: "https://akhuwat.org.pk/",
  },
  {
    title: "Basketball Team Captain",
    subtitle: "Sports",
    image: "assets/images/experience-page/NBA.png",
    desp: "Captain of the basketball team at Cadet College HasanAbdal, juniors.",
    href: "https://cch.edu.pk/",
  },
  {
    title: "Prime-Minister's Laptop Scheme",
    subtitle: "Awarded Laptop",
    image: "assets/images/experience-page/pmlaptop.png",
    desp: "Awarded PM's laptop for top GPA's in the batch.",
    href: "https://www.hec.gov.pk/english/services/students/pmnls/Pages/default.aspx",
  },
     
];

const showCards3 = () => {
  let output = "";
  mentor.forEach(
    ({ title, image, subtitle, desp, href }) =>
      (output += `  
      <div class="blog-slider__item swiper-slide">
        <div class="blog-slider__img">
            <img src="${image}" alt="">
        </div>
        <div class="blog-slider__content">
          <div class="blog-slider__title">${title}</div>
          <span class="blog-slider__code">${subtitle}</span>
          <div class="blog-slider__text">${desp}</div>
          <a href="${href}" class="blog-slider__button">Read More</a>   
        </div>
      </div>
      `)
  );
  hackathonsection.innerHTML = output;
};
document.addEventListener("DOMContentLoaded", showCards3);
