const toggle_pub_container = document.getElementById('toggle-pub-container');
const pub_container = document.getElementById('publications');
const pubs_by_date = pub_container.innerHTML;
const showSelectedHTML = '[<span id="show-selected">representative</span>';
const showAllHTML = '<span id="show-all">all</span>]';
const topics = [
    {tag: 'rl_syn', name: 'Robot Learning from Synthetic Data'},
    {tag: 'fmdm', name: 'Foundation Models for Decision Making'},
]


function showSelectedPublications() {
    if (document.querySelectorAll('.research_topic').length !== 0) {
        pub_container.innerHTML = pubs_by_date;
    }
    document.querySelectorAll('.pub-card').forEach(function (card) {
        card.style.display = card.getAttribute('data-selected') === 'true' ? '' : 'none';
    });
    document.querySelectorAll('.research_topic').forEach(function (topic) {
        topic.remove();
    });
    toggle_pub_container.innerHTML = showSelectedHTML + ' | <a href="javascript:void(0);" id="show-all">all</a>]';
    document.getElementById('show-all').addEventListener('click', showAllPublications);
}


function showAllPublications() {
    if (document.querySelectorAll('.research_topic').length !== 0) {
        pub_container.innerHTML = pubs_by_date;
    }
    document.querySelectorAll('.pub-card').forEach(card => card.style.display = '');
    document.querySelectorAll('.research_topic').forEach(function (topic) {
        topic.remove();
    });
    toggle_pub_container.innerHTML = '[<a href="javascript:void(0);" id="show-selected">representative</a> | ' + showAllHTML;
    document.getElementById('show-selected').addEventListener('click', showSelectedPublications);
}

document.addEventListener('DOMContentLoaded', function () {
    // Initialize with only selected publications displayed
    showSelectedPublications();
});

function clickAnyResearchTopic() {
    document.getElementById('toggle-pub-container').innerHTML = '[<a href="javascript:void(0);" id="show-selected">representative</a> | <a href="javascript:void(0);" id="show-all">all</a>]'
    document.getElementById('show-all').addEventListener('click', showAllPublications);
    document.getElementById('show-selected').addEventListener('click', showSelectedPublications);

    // order pub cards by topics if not exists
    if (document.querySelectorAll('.research_topic').length === 0) {
        let pub_cards_by_topics = [];

        for (let topic_idx = 0; topic_idx < topics.length; topic_idx++) {
            const topic_tag = topics[topic_idx].tag;
            let pub_cards_this_topic = []
            document.querySelectorAll('.pub-card').forEach(function (card) {
                if (card.getAttribute("data-topic") === topic_tag) {
                    pub_cards_this_topic.push(card.outerHTML)
                }
            });
            pub_cards_by_topics.push({
                tag: topics[topic_idx].tag,
                name: topics[topic_idx].name,
                filtered_content: pub_cards_this_topic
            });
        }

        let new_pub_content = '';
        for (let topic_idx = 0; topic_idx < topics.length; topic_idx++) {
            const tag = pub_cards_by_topics[topic_idx].tag;
            const name = pub_cards_by_topics[topic_idx].name;
            const content_this_topic = pub_cards_by_topics[topic_idx].filtered_content;

            new_pub_content += `<div class="col-12 research_topic" id="${tag}">${name}</div>`;
            for (const x of content_this_topic) {
                new_pub_content += x
            }
        }
        pub_container.innerHTML = new_pub_content;
        document.querySelectorAll('.pub-card').forEach(card => card.style.display = '');
    }
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({behavior: 'smooth'});
    }
}