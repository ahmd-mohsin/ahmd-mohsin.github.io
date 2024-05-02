/*Research Details Table*/

const researchTable = document.querySelector(".main");

const research = [
  {
    title: "Deep Reinforcement Learning for Trajectory and Beamforming Optimization in CoMP-NOMA Networks with Aerial RIS",
    authors:
      "Muhammad Umer∗, Muhammad Ahmed Mohsin∗, Syed Ali Hassan, Haejoon Jung,Mikael Gidlund, and Haris Pervaiz",
    conferences:
      "IEEE Globecomm 2024 @ Cape Town, South Africa",
    researchYr: 2024,
    citebox: "popup1",
    image: "assets/images/research-page/RL.png",
    citation: {
      vancouver:
        "Umer, M., Mohsin, M. A., Gidlund, M., Jung, H., & Hassan, S. A. (2024). Analysis of STAR-RIS Assisted Downlink CoMP-NOMA Multi-Cell Networks under Nakagami-m Fading. IEEE Communications Letters.",
    },
    abstract:
      "In this paper, we present a novel system model integrating UAV (unmanned aerial vehicles) with reconfigurable Intelligent Surfaces (RIS) assisted Coordinated multipoint (CoMP) Non-orthogonal multiple access (NOMA) wireless networks. We use deep-reinforcement learning (DRL) technique to cater for the dynamic environment to optimize UAV trajectory and passive beamforming at the RIS to optimize phase shifts and maximizing the sumrate of the network. The optimization problem is a mixed integer non-convex problem and involves discrete vari ables.(Something about RL approach here).Extensive simulations suggest that optimization of UAV-assisted RIS networks results in promising gains and high summrates across all users in the network.",
    absbox: "absPopup1",
  },

  {
    title: "On the Energy Efficiency and Passive Beamforming Design of RIS Assisted CoMP-NOMA Networks",
    authors:
      "Muhammad Umer∗, Muhammad Ahmed Mohsin∗, Syed Ali Hassan, Haejoon Jung,Mikael Gidlund, and Haris Pervaiz",
    conferences:
      "IEEE Globecom 2024 @ Cape Town, South Africa",
    researchYr: 2024,
    citebox: "popup2",
    image: "assets/images/research-page/energyeff.png",
    citation: {
      vancouver:
        "Umer, M., Mohsin, M. A., Gidlund, M., Jung, H., & Hassan, S. A. (2024). Analysis of STAR-RIS Assisted Downlink CoMP-NOMA Multi-Cell Networks under Nakagami-m Fading. IEEE Communications Letters.",
    },
    abstract:
      "Reconfigurable intelligent surfaces (RISs) and non orthogonal multiple access (NOMA) are promising technologies for enhancing the performance of future wireless networks. In this paper, we investigate the energy efficiency and passive beam forming (PBF) design of RIS-assisted CoMP-NOMA networks. We propose two distinct RIS configurations: enhancement-only PBF (EO) and enhancement & cancellation PBF (EC). Our analysis reveals that RIS-assisted CoMP-NOMA networks can significantly improve energy efficiency compared to traditional CoMP-NOMA networks. Furthermore, we formulate a PBF design problem to optimize the RIS phase shifts for maximizing energy efficiency. Our results demonstrate that the optimal PBF design depends on the number of cooperating BSs, the number of RIS elements, and the RIS configuration. The proposed RIS assisted CoMP-NOMA networks offer a promising solution for improving the energy efficiency and overall performance of future wireless networks",
    absbox: "absPopup2",
  },

  {
    title:
      "Analysis of STAR-RIS Assisted Downlink CoMP-NOMA Multi-Cell Networks under Nakagami-𝑚 Fading",
    authors: "Muhammad Umer , Muhammad Ahmed Mohsin Haejoon Jung , Mikael Gidlund , Senior Member, IEEE, and Syed Ali Hassan , Senior Member IEEE",
    conferences:
      "IEEE Communication Letters",
    researchYr: 2024,
    citebox: "popup3",
    image: "assets/images/research-page/commletter.png",
    citation: {
      vancouver:
        "Umer, M., Mohsin, M. A., Gidlund, M., Jung, H., & Hassan, S. A. (2024). Analysis of STAR-RIS Assisted Downlink CoMP-NOMA Multi-Cell Networks under Nakagami-m Fading. IEEE Communications Letters.",
    },
    abstract:
      "In this letter, we conduct a thorough analytical assessment of a simultaneously transmitting and reflecting reconfigurable intelligent surface (STAR-RIS) assisted non orthogonal multiple access (NOMA) enhanced coordinated multipoint (CoMP) multi-cell network under Nakagami-𝑚 fading. Using the central limit theorem (CLT) and moment matching based Gamma approximation method, we derive the distributions of effective and cascaded channel gains. Subsequently, leveraging these results, we formulate tractable equations for ergodic rates and outage probabilities across all users in the network. Our analytical results correlate with the simulation results, affirming the efficacy of analytical methodology. Furthermore, the results demonstrate a signifi cant performance improvement of STAR-RIS assisted networks.",
    absbox: "absPopup3",
  },

  {
    title:
      "Performance Analysis of STAR-RIS Enhanced CoMP-NOMA Multi-Cell Networks",
    authors:
      "Muhammad Umer∗, Muhammad Ahmed Mohsin∗, Syed Ali Hassa∗, Haejoon Jung, and Haris Pervaiz",
    conferences:
      "IEEE Globecom 2023 @ Malaysia.",
    researchYr: 2023,
    citebox: "popup4",
    image: "assets/images/research-page/performance.png",
    citation: {
      vancouver:
        "Umer, M., Mohsin, M. A., Hassan, S. A., Jung, H., & Pervaiz, H. (2023, December). Performance Analysis of STAR-RIS Enhanced CoMP-NOMA Multi-Cell Networks. In 2023 IEEE Globecom Workshops (GC Wkshps) (pp. 2000-2005). IEEE.",
    },
    abstract:
      "In this paper, we present a novel approach to enhance data rates in a multi-cell network through a perti nent combination of simultaneously transmitting and reflecting reconfigurable intelligent surfaces (STAR-RISs), non-orthogonal multiple access (NOMA), and coordinated multi-point trans mission (CoMP). Through the strategic deployment of STAR RISs and CoMP for mitigation of inter-cell interference (ICI), data rates for cell-edge users are significantly improved. The system’s overall performance is further optimized by employing exhaustive iteration techniques. Additionally, this paper explores the resource sharing of STAR-RIS among both the transmitting and receiving elements of the network through element splitting and amplitude adjustments. These findings offer valuable insights for the future design and optimization of wireless communication systems.",
    absbox: "absPopup4",
  },

  {
    title: "MINDTwin AI: Multiphysics Informed Digital-Twin  for Fault Localization in Induction Motor using AI",
    authors: " Amina Bashir∗, Muhammad Ahmed Mohsin∗,Muhammad Jazib∗, Hafsa Iqbal",
    conferences:
      "IEEE BigData 2023 @ Bulgeria, Sofia",
    researchYr: 2023,
    citebox: "popup5",
    image: "assets/images/research-page/mindtwin.png",
    citation: {
      vancouver:
        "Bashir, A., Mohsin, M. A., Jazib, M., & Iqbal, H. (2023, November). MINDTwin AI: Multiphysics Informed Digital-Twin for Fault Localization in Induction Motor Using AI. In 2023 International Conference on Big Data, Knowledge and Control Systems Engineering (BdKCSE) (pp. 1-8). IEEE.",
    },
    abstract:
      "This paper focuses on an Artificial Intelligence (AI) based approach for fault localization in a squirrel cage three phase induction motor (TIM). A multifaceted Digital-Twin (DT) is designed by integrating physics domain knowledge with AI algorithms. The aim is to design a Multiphysics-informed hybrid DT for fault detection and localization in TIM. To achieve this, a high-fidelity computational model of an induction motor is developed using the Finite Element Analysis (FEA) in COMSOL Multiphysics. The model parameters, loading conditions, and boundary conditions are meticulously tuned with an experimental workbench using a Sparse Nonlinear Optimization (SNOPT) solver. Simulations are conducted to replicate various electrical and mechanical defects. Additionally, the model order reduction technique is employed to generate a reduced state-space model, enabling the high-fidelity dynamic system to act as a virtual sensor exhibiting real-time capabilities. The feature fusion pro cess leverages Canonical Correlation Analysis (CCA) within the hybrid DT modeling framework. Comparative analysis demon strates that the Multiphysics-informed hybrid modeling approach enhances the interpretability of AI classifiers, improving real-time condition monitoring and fault localization in TIM.",
    absbox: "absPopup5",
  },

  {
    title: "Zero-Shot Learning via GANs and SAGANs: A Performance Analysis",
    authors: "Muhammad Ahmed Mohsin",
    conferences:
      "IEEE FIT 2023",
    researchYr: 2023,
    citebox: "popup6",
    image: "assets/images/research-page/zero.png",
    citation: {
      vancouver:
        "Mohsin, M. A. (2023, December). Zero-Shot Learning via GANs and SAGANs: A Performance Analysis. In 2023 International Conference on Frontiers of Information Technology (FIT) (pp. 37-42). IEEE.",
    },
    abstract:
      "This paper presents a novel study on Zero-Shot Learning (ZSL) using Generative Adversarial Networks (GAN) and Self-Attention Generative Adversarial Networks (SAGAN). We explore the application of GAN and SAGAN models for ZSL tasks and conduct an in-depth performance analysis on the CUB and NAB datasets. To enhance the performance of SAGAN, a custom augmentation pipeline is proposed. Additionally, we investigate the converging behavior of both GANs to gain insights into their convex loss landscapes. Experimental results demonstrate that SAGAN outperforms GAN in ZSL accuracy and AUC (Area Under Curve) scores on all datasets. The f indings highlight the significance of self-attention mechanisms and reduced model collapses in SAGAN for improved image generation and discrimination tasks.",
    absbox: "absPopup6",
  },

  {
    title:
      "PyramidTabNet: Transformer-based Table Recognition in Image-based Documents",
    authors: "Muhammad Umer, Muhammad Ahmed Mohsin, Adnan Ul-Hasan, and Faisal Shafait",
    conferences:
      "ICDAR 2023 Springer Nature @ San Jose, California",
    researchYr: 2023,
    citebox: "popup7",
    image: "assets/images/research-page/pyramid.png",
    citation: {
      vancouver:
        "Umer, M., Mohsin, M. A., Ul-Hasan, A., & Shafait, F. (2023, August). PyramidTabNet: Transformer-Based Table Recognition in Image-Based Documents. In International Conference on Document Analysis and Recognition (pp. 420-437). Cham: Springer Nature Switzerland.",
    },
    abstract:
      "Table detection and structure recognition is an important component of document analysis systems. Deep learning-based trans former models have recently demonstrated significant success in various computer vision and document analysis tasks. In this paper, we intro duce PyramidTabNet (PTN), a method that builds upon Convolution less Pyramid Vision Transformer to detect tables in document images. Furthermore, we present a tabular image generative augmentation tech nique to effectively train the architecture. The proposed augmentation process consists of three steps, namely, clustering, fusion, and patching, for the generation of new document images containing tables. Our pro posed pipeline demonstrates significant performance improvements for table detection on several standard datasets. Additionally, it achieves performance comparable to the state-of-the-art methods for structure recognition tasks.",
    absbox: "absPopup7",
  },
];
AOS.init();
const fillData = () => {
  let output = "";
  research.forEach(
    ({
      image,
      title,
      authors,
      conferences,
      researchYr,
      citebox,
      citation,
      absbox,
      abstract,
    }) =>
      (output += `
            <tr data-aos="zoom-in-left"> 
                <td class="imgCol"><img src="${image}" class="rImg"></td>
                <td class = "researchTitleName">
                    <div class="img-div">
                        <span class="imgResponsive">
                            <img src="${image}" class="imgRes">
                        </span>
                    </div>
                    <a href="#0" class="paperTitle"> ${title} </a> 
                    <div class = "authors"> ${authors} </div> 
                    
                    <div class="rConferences"> ${conferences} 
                        <div class="researchY">${researchYr}</div>
                    </div>
                    
                    <!--CITE BUTTON-->
                    <div class="d-flex" style="margin-right:5%;">
                        <button class="button button-accent button-small text-right button-abstract " type="button" data-toggle="collapse" data-target="#${absbox}" aria-expanded="false" aria-controls="${absbox}">
                            ABSTRACT
                        </button>
                
                        <button class="button button-accent button-small text-right button-abstract " type="button" data-toggle="collapse" data-target="#${citebox}" aria-expanded="false" aria-controls="${citebox}">
                            CITE
                        </button>
                    </div>
                    <div id="${absbox}" class="collapse" aria-labelledby="headingTwo" data-parent=".collapse">
                        <div class="card-body">
                            ${abstract}    
                        </div>
                    </div>
                    <div id="${citebox}" class="collapse" aria-labelledby="headingTwo" data-parent=".collapse">
                        <div class="card-body">
                            ${citation.vancouver}    
                        </div>
                    </div>
                </td>
            </tr>`)
  );
  researchTable.innerHTML = output;
};
document.addEventListener("DOMContentLoaded", fillData);
