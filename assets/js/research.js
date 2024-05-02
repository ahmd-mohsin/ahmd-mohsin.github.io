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
      "A Contextual Hierarchical Attention Network with Adaptive Objective for Dialogue State Tracking",
    authors:
      "Yong Shan, Zekang Li, Jinchao Zhang, Fandong Meng, Yang Feng, Cheng Niu and Jie Zhou",
    conferences:
      "The 58th Annual Meeting of the Association for Computational Linguistics",
    researchYr: 2020,
    citebox: "popup4",
    image: "assets/images/research-page/dialogueState.png",
    citation: {
      vancouver:
        "Yong Shan, Zekang Li, Jinchao Zhang, Fandong Meng, Yang Feng, Cheng Niu and Jie Zhou. A Contextual Hierarchical Attention Network with Adaptive Objective for Dialogue State Tracking. The 58th Annual Meeting of the Association for Computational Linguistics 2020.",
    },
    abstract:
      "This is currently left empty and this can be considered as a dummy data 4",
    absbox: "absPopup4",
  },

  {
    title: "Dual Super-Resolution Learning for Semantic Segmentation",
    authors: "Wang, Li and Li, Dong and Zhu, Yousong and Tian, Lu and Shan, Yi",
    conferences:
      "IEEE/CVF Conference on Computer Vision and Pattern Recognition (CVPR)",
    researchYr: 2020,
    citebox: "popup5",
    image: "assets/images/research-page/semanticSegmentation.png",
    citation: {
      vancouver:
        "Wang, Li and Li, Dong and Zhu, Yousong and Tian, Lu and Shan, Yi. Dual Super-Resolution Learning for Semantic Segmentation. IEEE/CVF Conference on Computer Vision and Pattern Recognition (CVPR) 2020.",
    },
    abstract:
      "This is currently left empty and this can be considered as a dummy data 5",
    absbox: "absPopup5",
  },

  {
    title: "Deep Unfolding Network for Image Super-Resolution",
    authors: "Zhang, Kai and Van Gool, Luc and Timofte, Radu",
    conferences:
      "IEEE/CVF Conference on Computer Vision and Pattern Recognition (CVPR)",
    researchYr: 2020,
    citebox: "popup6",
    image: "assets/images/research-page/deepNetwork.png",
    citation: {
      vancouver:
        "Zhang, Kai and Van Gool, Luc and Timofte, Radu. Deep Unfolding Network for Image Super-Resolution. IEEE/CVF Conference on Computer Vision and Pattern Recognition (CVPR) 2020.",
    },
    abstract:
      "This is currently left empty and this can be considered as a dummy data 6",
    absbox: "absPopup6",
  },

  {
    title:
      "Unsupervised Learning for Intrinsic Image Decomposition From a Single Image",
    authors: "Liu, Yunfei and Li, Yu and You, Shaodi and Lu, Feng",
    conferences:
      "IEEE/CVF Conference on Computer Vision and Pattern Recognition (CVPR)",
    researchYr: 2020,
    citebox: "popup7",
    image: "assets/images/research-page/imageDecomposition.png",
    citation: {
      vancouver:
        "Liu, Yunfei and Li, Yu and You, Shaodi and Lu, Feng. Unsupervised Learning for Intrinsic Image Decomposition From a Single Image. IEEE/CVF Conference on Computer Vision and Pattern Recognition (CVPR) 2020.",
    },
    abstract:
      "This is currently left empty and this can be considered as a dummy data 7",
    absbox: "absPopup7",
  },
  {
    title:
      "Forward and Backward Information Retention for Accurate Binary Neural Networks",
    authors:
      "Qin, Haotong and Gong, Ruihao and Liu, Xianglong and Shen, Mingzhu and Wei, Ziran and Yu, Fengwei and Song, Jingkuan",
    conferences:
      "IEEE/CVF Conference on Computer Vision and Pattern Recognition (CVPR)",
    researchYr: 2020,
    citebox: "popup8",
    image: "assets/images/research-page/neuralNetworks.jpg",
    citation: {
      vancouver:
        "Qin, Haotong and Gong, Ruihao and Liu, Xianglong and Shen, Mingzhu and Wei, Ziran and Yu, Fengwei and Song, Jingkuan. Forward and Backward Information Retention for Accurate Binary Neural Networks. IEEE/CVF Conference on Computer Vision and Pattern Recognition (CVPR) 2020.",
    },
    abstract:
      "This is currently left empty and this can be considered as a dummy data 8",
    absbox: "absPopup8",
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
