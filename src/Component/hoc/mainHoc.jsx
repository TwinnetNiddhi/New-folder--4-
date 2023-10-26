// import $ from 'jquery'
// import { Fragment, useEffect } from "react"
// import Header from '../Headers/Header'
// import Navbar from '../Headers/Navbar'

// const mainHoc = (Component,showGoodMorning) => {
//     const NewComponent = () => {
//         // useEffect(() => {
//         //     $(document).ready(function(){
//         //         console.log("hello")
//         //         // detailed menu open close arrow
//         //         $('.pages ').on('click', '.arrow',function(){
//         //             $('.detailed-menu-col').toggleClass('close');
//         //             $(this).toggleClass('right');
//         //             $('.pages .main-dashboard').toggleClass('expand');
//         //         });
            
//         //         // mobile nav
//         //         $('.pages .mobile-nav .right .menu-icon').on('click', function(){
//         //             $('.pages .mobile-nav .mobile-menu').addClass('open');
//         //             $('.bg-overlay').addClass('open');
//         //         });
//         //         $('.pages .close-icon, .bg-overlay').on('click', function(){
//         //             $('.pages .mobile-nav .mobile-menu').removeClass('open');
//         //             $('.bg-overlay').removeClass('open');
//         //         });
            
//         //         // dropdown
//         //         $('.submenu').slideUp(500);
//         //         $('ul li a:not(:only-child)').click(function (e) {
//         //             $(this).siblings('.submenu').slideToggle(500);
//         //             $(this).toggleClass('open-arrow');
//         //             // Close one dropdown when selecting another
//         //             if($(window).width() > 991) {
//         //                 $('.submenu').not($(this).siblings()).slideUp(500);
//         //                 $('.pages .detailed-menu ul li a').not($(this)).removeClass('open-arrow');
//         //             }
//         //             e.stopPropagation();
//         //         });
            
//         //         // profile dropdown menu
//         //         $('#dashboard-page .top-header .right .profile .profile-menu .menu-body ul.user-menu').slideUp();
//         //         $('.user-btn').on('click', function(){
//         //             $('.user-menu').slideToggle(500);
//         //             $(this).toggleClass('active');
//         //         });
            
//         //         // black mode switch
//         //         $('.switch input').on('click', function () {
//         //             $(this).parent().toggleClass('active');
//         //         });
                
//         //         // slide down open dropdown
//         //         if($(window).width() > 991) {
//         //             $('.pages .detailed-menu ul li .submenu ul li a.active').each(function(){
//         //                 $(this).closest('.detailed-menu-main-li').children().addClass('open-arrow');
//         //                 $(this).closest('.submenu').slideDown();	
//         //             });
//         //         }	
//         //         if($(window).width() < 991) {
//         //             $('.pages ul li .submenu ul li .submenu ul li a.active').each(function(){
//         //                 $(this).closest('.mobile-menu-li').children().addClass('open-arrow');
//         //                 // $(this).parent().closest('.pages ul li .submenu ul li .submenu ul li').children().addClass('open-arrow');
//         //                 $(this).parent().parent().parent().parent().children().addClass('open-arrow');
//         //                 $(this).parent().closest('.submenu').slideDown();
//         //                 $(this).parent().parent().parent().parent().closest('.submenu').slideDown().addClass('this');
//         //             });
//         //         }
            
//         //         // profile dropdown 
//         //         $('.pages .profile .profile-img').on('click', function(){
//         //             $('.pages .profile .profile-menu').toggleClass('show');
//         //             $('.pages .notification-menu').removeClass('show');
//         //         });
            
//         //         // notification dropdown
//         //         $('.pages .notification svg.main-svg').on('click', function(){
//         //             $('.pages .notification-menu').toggleClass('show');
//         //             $('.pages .profile .profile-menu').removeClass('show');
//         //         });
//         //         $('.pages .notification-menu .close-btn').on('click', function(){
//         //             $('.pages .notification-menu').removeClass('show');
//         //         });
            
//         //         // sort button dropdown
//         //         $('#users-page .main-dashboard .country .left-panel .header .sort').on('click', function(){
//         //             $('#users-page .main-dashboard .country .left-panel .header .sort .dropdown').toggleClass('open');
//         //         });
            
//         //         // popup image slider
//         //         console.log('init-scroll: ' + $('.nav-next').scrollLeft());
//         //         $('#country-popup .body .slider-parent .arrow.nav-next').on('click', function () {
//         //             $('#country-popup .body .image-slider').animate({ scrollLeft: '+=460' }, 200);
//         //         });
//         //         $('#country-popup .body .slider-parent .arrow.nav-prev').on('click', function () {
//         //             $('#country-popup .body .image-slider').animate({ scrollLeft: '-=460' }, 200);
//         //         });
            
//         //         // popup open
//         //         $('.popup-open').on('click', function(){
//         //             $('#country-popup').addClass('open');
//         //             $('.bg-overlay').addClass('open');
//         //         })
//         //         $('#country-popup .close-btn, .bg-overlay').on('click', function(){
//         //             $('#country-popup').removeClass('open');
//         //             $('.bg-overlay').removeClass('open');
//         //         });
            
                  
//         //         // timeline collapse
//         //         // $('#user-details-page .main-content .left-panel .timeline .main-item .information .timeline-collapse-btn').on('click', function(){
//         //         // 	$('#user-details-page .main-content .left-panel .timeline .main-item').closest('.timeline .main-item .body').slideToggle();
//         //         // });
//         //         $('#user-details-page .main-content .left-panel .timeline .main-item .body').slideUp();
//         //         $('.timeline-collapse-btn').click(function (e) {
//         //             $(this).parent().parent().parent().parent().children('#user-details-page .main-content .left-panel .timeline .main-item .body').slideToggle(500);
//         //             $(this).toggleClass('arrow-down');
//         //             e.stopPropagation();
//         //         });
            
//         //     });
//         // }, [])

//         return (
//             <Fragment>
//                 <section id='dashboard-page' className='pages'>
//                     <main className="h-100" id="dashboard-main">
//                         <div className="row gx-lg-2 gx-0">
//                             <div className="bg-overlay"></div>
//                             <Header />
//                             <div className="col-lg-9 left-col main-dashboard header-custom-col">
//                                 <Navbar showGoodMorning={showGoodMorning} />
//                                 <Component />
//                             </div>
//                         </div>
//                     </main>
//                 </section>
//             </Fragment>
//         )
//     }

//     return NewComponent
// }

// export default mainHoc