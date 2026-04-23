// ============================================
// FAQ.JS - FAQ Accordion Functionality
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        item.addEventListener('click', function() {
            const icon = this.querySelector('.faq-icon');
            const isOpen = icon.textContent === '−';
            const answer = this.querySelector('.faq-answer');
            
            // Toggle current FAQ
            if (isOpen) {
                // Close this one
                icon.textContent = '+';
                this.style.background = 'rgba(30, 27, 75, 0.5)';
                if (answer) answer.remove();
            } else {
                // Open this one
                icon.textContent = '−';
                this.style.background = 'rgba(168, 85, 247, 0.2)';
                
                // Add answer if it doesn't exist
                if (!answer) {
                    const newAnswer = document.createElement('p');
                    newAnswer.className = 'faq-answer';
                    newAnswer.style.marginTop = '1rem';
                    newAnswer.style.color = '#9ca3af';
                    newAnswer.style.lineHeight = '1.6';
                    
                    // Different answers for each question
                    const question = this.querySelector('.faq-question').textContent;
                    
                    if (question.includes('What is League of Legends Boosting')) {
                        newAnswer.textContent = 'League of Legends Boosting is a professional service in which a skilled LoL Player either plays on your account or partners with you in duo queue to improve your rank, MMR, or Elo.';
                    } else if (question.includes('What is League of Legends Coaching')) {
                        newAnswer.textContent = 'LoL Coaching is a personalized service providing one-on-one sessions aimed at assisting League of Legends players in improving their gameplay. The primary objective of Coaching is to enable players to ascend to higher ranks, improve their mechanics and macro strategies, and refine their in-game mindset.';
                    } else if (question.includes('What League of Legends Accounts do you offer')) {
                        newAnswer.textContent = 'We offer a comprehensive selection of League of Legends accounts across all ranks, including Fresh Unranked, Iron, Bronze, Silver, Gold, Platinum, Emerald, Diamond, Master, Grandmaster, and Challenger. Additionally, we provide fresh smurf accounts customized with a skin of your choice and specialized LoL skin accounts, featuring an easy-to-use skin search. Browse a variety of high quality LoL Accounts now!';
                    } else if (question.includes('Can I see the champions and skins before buying')) {
                        newAnswer.textContent = 'When you select an account of your interest, you will have complete access of the account details, including a complete list of champions, skins, and more.';
                    } else if (question.includes('What is the warranty on League of Legends')) {
                        newAnswer.textContent = 'We provide lifetime warranty and 24/7 instant support for every smurf account we offer.';
                    } else if (question.includes('What is iMUSTGLIDE?')) {
                        newAnswer.textContent = 'iMUSTGLIDE is a gaming marketplace that provides high-quality accounts, in-game items, currencies, and other gaming services for any game.';
                    } else if (question.includes('How can I Work')) {
                        newAnswer.textContent = 'We are always looking for new sellers, boosters, and affiliates to join our platform. If you are interested, simply visit our Work With Us page and submit your application. If you are a content creator and would love to be a Glider creator, check out our Affiliate Program page. We also occasionally post new job openings for additional roles, so be sure to check back for updates!';
                    } else if (question.includes('discounts')) {
                        newAnswer.textContent = 'At iMUSTGLIDE, we offer discounts, promotions, free lootboxes with huge rewards, and events with the chance to win amazing prizes. Feel free to contact our LiveChat for a discount code if you dont have one and to follow our Discord for new events!';
                    } else if (question.includes('payment methods')) {
                        newAnswer.textContent = 'We use Stripe as our payment processor. You can pay with Credit Card, Debit Card, Apple Pay, Google Pay, IDEAL, SOFORT, Przelewy24, Bancontact and cryptos. Some payment methods may take longer to process. We can also offer Paypal and Paysafecards on 20$+ orders only (requires a manual support from our manager on discord). For other payment methods, please contact us on livechat!';
                    } else if (question.includes('more questions')) {
                        newAnswer.textContent = 'We are here 24/7. Feel free to contact us on our Live Chat or Discord.';
                    } else if (question.includes('What is LoL Boosting')) {
                        newAnswer.textContent = 'LoL Boosting is a professional service where a high-elo player plays on your account to advance your rank. Our boosters are verified Challenger and Grandmaster players who will efficiently and safely boost your account to your desired rank.';
                    } else if (question.includes('How does LoL Rank Boost work')) {
                        newAnswer.textContent = 'After purchasing, you provide your account credentials to your assigned booster. The booster then plays ranked games on your account until your desired rank is achieved. You can track progress in real-time through your dashboard and communicate with your booster at any time.';
                    } else if (question.includes('Why should I choose iMUSTGLIDE for LoL Boosting')) {
                        newAnswer.textContent = 'iMUSTGLIDE only works with verified high-elo players, offers 24/7 live support, uses VPN protection for your account\'s security, guarantees fast delivery, and provides a money-back guarantee if the service cannot be completed.';
                    } else if (question.includes('When will my LoL Boost order be completed')) {
                        newAnswer.textContent = 'Most orders start within 30 minutes of purchase. Completion time depends on the number of divisions to boost and queue conditions, but typically ranges from a few hours to a few days for larger orders.';
                    } else if (question.includes('Is LoL Boosting Safe')) {
                        newAnswer.textContent = 'Absolutely! Our boosters use VPNs matching your region, play at normal human speeds, and follow strict security protocols. We have thousands of completed orders with no bans. Your account safety is our top priority.';
                    } else if (question.includes('Can I still play while my boost')) {
                        newAnswer.textContent = 'We recommend pausing your own play while the boost is active to avoid simultaneous login detection. You can coordinate play times with your booster through your dashboard to schedule breaks whenever you want to play.';
                    } else if (question.includes('What is League of Legends Coaching')) {
                        newAnswer.textContent = 'League of Legends coaching is a service where professional players help you improve your skills in the game. Our coaches are all high elo players who specialize in enhancing your mechanics, macro understanding, and mental approach to the game.';
                    } else if (question.includes('What does a LoL coach do')) {
                        newAnswer.textContent = 'A League of Legends coach specializes in analyzing your gameplay and providing strategic insights to improve your performance. They focus on refining your champion mastery, map awareness, and objective control, ensuring your actions are both effective and purposeful.';
                    } else if (question.includes('Is Improving Your Rank Guaranteed')) {
                        newAnswer.textContent = 'Yes, we guarantee that you will improve your rank through our coaching services. We are so confident in the quality of our coaching that we offer a 100% satisfaction guarantee, promising visible improvements in your performance and rank progression.';
                    } else if (question.includes('What can a LoL Coach teach me')) {
                        newAnswer.textContent = 'A League Coach can improve your gameplay by sharpening your mechanics, helping you understand important game strategies, and refining your macro-level decision-making. They will identify and help you eliminate bad habits, providing advice to elevate your performance efficiently.';
                    } else if (question.includes('Is this coaching suitable for beginners')) {
                        newAnswer.textContent = 'Yes, our coaching is designed to be inclusive and beneficial for players at all skill levels, including beginners. Our coaches adapt their teaching methods to match your current skill level, ensuring concepts are explained clearly and at an appropriate pace.';
                    } else if (question.includes('Can I learn about specific champions')) {
                        newAnswer.textContent = 'Certainly! Our coaching sessions offer detailed guidance and instruction tailored to your preferred champions. You will gain insights into each champion\'s unique strengths and weaknesses, as well as strategic advice on how to effectively utilize their abilities in various game scenarios.';
                    } else if (question.includes('What happens after I hire a LoL coach')) {
                        newAnswer.textContent = 'Once your payment is processed, you will gain immediate access to communicate with a coach through the chat feature on your dashboard. Your order will enter a queue, and one of our challenger coaches will soon select it.';
                    } else if (question.includes('Can I Change My League of Legends Coach')) {
                        newAnswer.textContent = 'If you encounter any issues with your league of legends coach or feel the need for a change, please contact our live chat support. We are committed to ensuring a positive coaching experience and will gladly arrange for another coach to take over.';
                    } else if (question.includes('How Can I Pay for LoL Coaching')) {
                        newAnswer.textContent = 'We accept a wide range of payment methods through our secure processor, Stripe. You can make payments using Credit Cards, Debit Cards, Apple Pay, Google Pay, IDEAL, SOFORT, Przelewy24, Bancontact, and various cryptocurrencies.';
                    } else if (question.includes('What language will the LoL Coaching be carried out')) {
                        newAnswer.textContent = 'Our coaching sessions are primarily conducted in English, as all our coaches are proficient in English. However, given our global network of coaches, we may be able to accommodate coaching sessions in other languages upon request.';
                    } else if (question.includes('How many hours of LoL Coaching do I need')) {
                        newAnswer.textContent = 'The number of coaching hours you might need varies based on your current skill level and your specific improvement goals. If you\'re uncertain, we recommend beginning with a 1-2 hour introductory session to discuss your objectives.';
                    } else if (question.includes('How will my smurf account be delivered')) {
                        newAnswer.textContent = 'Once payment is completed, your smurf account will be delivered to your dashboard and sent to your email.';
                    } else if (question.includes('refund policy on smurf')) {
                        newAnswer.textContent = 'We offer lifetime warranty on all our accounts. If you have any issues with the account, you can contact us and we will try to resolve the issue.';
                    } else if (question.includes('How long does it take to get my smurf')) {
                        newAnswer.textContent = 'The delivery of your smurf account is instant. As soon as you complete the purchase, you will receive immediate access and you can start playing on your ready fresh, unranked account.';
                    } else if (question.includes('Can I play ranked')) {
                        newAnswer.textContent = 'Definitely! Our smurf accounts have a minimum level of 30, which is the requirement to play ranked games.';
                    }
                    
                    this.appendChild(newAnswer);
                }
            }
        });
    });
});