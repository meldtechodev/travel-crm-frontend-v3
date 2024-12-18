import React, { useContext, useEffect, useRef, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { data } from 'autoprefixer';
import axios from 'axios';
import api from '../apiConfig/config';
import { UserContext } from '../contexts/userContext';
// import logo from './assets/images/pdf/logo2.jpg'

const PdfFile = ({ data, isModalOpen, onClose }) => {
  // const [isModalOpens, setIsModalOpen] = useState(true)
  const pdfRef = useRef(); // Reference to the HTML element

  const { user } = useContext(UserContext)

  console.log(data)

  const generatePDF = async () => {
    const element = pdfRef.current; // The HTML content to convert into a PDF

    if (element) {
      const canvas = await html2canvas(element, {
        scale: 2, // Higher resolution
        useCORS: true, // Handle cross-origin images
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = 190; // PDF width in mm (excluding margins)
      const pageHeight = 295; // PDF height in mm
      const imgWidth = pdfWidth; // Set image width to fit the PDF width
      const imgHeight = (canvas.height * imgWidth) / canvas.width; // Scale the image to maintain aspect ratio
      let heightLeft = imgHeight;
      let position = 0;

      // Add the first page
      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add remaining pages
      while (heightLeft > 0) {
        position -= pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("generated.pdf");
    }

    isModalOpen(false)
    onClose(true)
  };

  return (
    <>
      <div
        className="bg-white w-full p-4 rounded-lg rounded-b-none shadow-lg"

        ref={pdfRef}
        id="modal-content"
      >

        <div class="header pdf-header">
          <div>
            <h1>{data.query?.requirementType}</h1>
            <p class="trip-details flex flex-col">
              <span className='mr-2'>{data.query?.nights} Nights / {data.query?.days} Days</span>
              Customizable
            </p>
          </div>
          <div class="logo">
            <img src='/assets/images/pdf/logo2.jpg' width="100%" alt="motherson-logo" />
          </div>
        </div>
        <div class="mainParaPdf">
          <div className='flex gap-2 my-4'>
            <img src="/assets/images/pdf/comma.png" alt="comma-img" width="100%;" />
            <span className='text-xl font-bold'>A Package for {data?.query.salutation} {data?.query.fname} {data?.query.lname}</span>
          </div>
          <p>
            Enjoy the many shades of { }. From the stunning skylines to the mystical deserts and bustling markets to luxurious malls. Hop on cruises or get your thrill with watersports, there's something for everyone!
          </p>
        </div>
        <div class="contentQuotation">
          <div class="contents">
            <h3>Contents</h3>
            <ul className='mt-4'>
              <li>
                <span>1</span>
                Your Itinerary
              </li>
              <li>
                <span>2</span>
                Day Wise Details
              </li>
              <li>
                <span>3</span>
                How To Book
              </li>
              <li>
                <span>4</span>
                Cancellation & Date Change Policies
              </li>
            </ul>
          </div>
          <div class="quotation">
            <p>
              Curated by
              <br />
              <span class="curated-by">{`${user.name} ${user.mname} ${user.lname}`} </span>
            </p>
            <p class="contact-info">
              Call: {user.mobnumber}
              <br />
              Email: {user.email}
            </p>
            <p>
              Quotation Created on {data?.query.query_Date}
              <br />
              01:52 PM
            </p>
          </div>
        </div>
        <div class="highlightHeading">
          <h3>Highlights</h3>
          <div class="highlights">
            <div class="highlight-item">
              <span>
                <img src="/assets/images/pdf/flights.png" width="100%" alt="Flights" />
              </span>
              <p>2 Flights</p>
            </div>
            <div class="highlight-item">
              <span>
                <img src="/assets/images/pdf/hotels.png" width="100%" alt="Hotel" />
              </span>
              <p>1 Hotel</p>
            </div>
            <div class="highlight-item">
              <span>
                <img src="/assets/images/pdf/activities.png" width="100%" alt="Activities" />
              </span>
              <p>5 Activities</p>
            </div>
            <div class="highlight-item">
              <span>
                <img src="/assets/images/pdf/transfer.png" width="100%" alt="Transfers" />
              </span>
              <p>2 Transfers</p>
            </div>
          </div>
          <div class="highlights001">
            <div class="highlight-item">
              <span>
                <img src="/assets/images/pdf/visa-included.png" width="100%" alt="visa" />
              </span>
              <p>Visa Included</p>
            </div>
            <div class="highlight-item">
              <span>
                <img src="/assets/images/pdf/meals.png" width="100%" alt="meals" />
              </span>
              <p>Selected Meals Included</p>
            </div>
          </div>
        </div>
        <div class="viewYourQuotes">
          <div class="viewYourQuotesLeft">
            <h4>
              <img src="/assets/images/pdf/luggage.png" width="100%" alt="luggage-img" />
              Now, Plan Your Trips with Meld Techo Travel CRM
            </h4>
            <div class="quoteParagraph">
              <ul>
                <li>Track quotations</li>
              </ul>
              <ul>
                <li>Customize your quotes</li>
              </ul>
              <ul>
                <li>Communicate in real-time</li>
              </ul>
            </div>
          </div>
          <div class="viewYourQuotesRight">
            <a href="#">View Your Quote</a>
          </div>
        </div>
        <div class="payNow">
          <h4> Total cost Excluding TCS</h4>
          <p>
            Package price, payment schedule and cancellation policy are tentative and subject to change.
            Package price, payment schedule and cancellation policy as shown on the Package Review Page
            is subject to change after applicable TCS amount in the booking.
          </p>
          <div class="payNowInner">
            <p>
              <span className='mr-2'>&#8377;{data.query?.totalCost}</span>
              For {data.query?.totalTravellers} Adults
            </p>
            <a href="#" >Pay Now</a>
          </div>
        </div>
        <p class="savePapper">
          Please think twice before printing this mail. Save paper, it's good for the environment.
        </p>
        <div class="secondHeader">
          <h6>TCS is mandatory for International Travel Packages</h6>
          <h6> 20% TCS is applicable on individual transactions above Rs. 7,00,000 per annum</h6>
          <p>
            As per Union Budget 2023, 5% TCS will be applicable on International travel packages up till Rs. 7,00,000
            (excluding TCS) against each PAN in a financial year (FY). Above this limit, TCS will be applicable at 20% on
            the incremental amount.
          </p>
          <p>
            <span>TCS is neither a cost nor additional tax,</span>
            it can be fully adjusted against income tax liability and excess, if any,
            can be claimed as refund.
          </p>
        </div>
        <div class="headerThird">
          <h2>Your Itinerary</h2>
          <p class="subheader">{data.query?.requirementType}</p>
          {/* <p class="detailsPdf">
            <img src="/assets/images/pdf/flights.png" width="100%" alt="flight-img" />
            Arrival in Dubai by IndiGo Flight 6E-1461 | Departing on 01 Aug, 08:40 AM | Arriving on 01 Aug, 10:50 AM | Includes Check in Baggage
          </p>
          <p class="detailsPdf">
            <img src="/assets/images/pdf/transfer.png" width="100%" alt="car-img" />
            Airport to hotel in Dubai
          </p> */}
        </div>
        <table class="tableSec">
          <thead>
            <tr>
              <th>Day</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {data?.pkgItinerary && data?.pkgItinerary.map((item, i) =>
              <tr>
                <td class="day-header">{item.date} Day {i + 1}</td>
                <td>
                  {/* {item.daytitle || 'Check in to Sea View Hotel Bur Dubai WT - Holidays Selections, 4 Star'} */}
                  Day Title: {item.daytitle} Meals: {item.meals ? item.meals : 'Not Included'}, Sightseeing: {item.sightseeingIds}
                  <hr />
                  <br />
                  {item.program}
                </td>
              </tr>
            )}
            {/* <tr>
              <td class="day-header">Fri, Aug 2, Day 2</td>
              <td>
                Day Meals: Breakfast : Included at Sea View Hotel Bur Dubai WT
                Holidays Selections , Dubai
                <hr />
                <br />
                Burj Khalifa At the Top Non-Prime Time with Aquarium Underwater zoo
                combo Tickets Only with Shared Transfers ZONE- Bur Dubai /Deira /SZR
                /Downtown / business bay / Al Barsha /Tecom
              </td>
            </tr>
            <tr>
              <td class="day-header">Sat, Aug 3, Day 3</td>
              <td>
                Day Meals: Breakfast : Included at Sea View Hotel Bur Dubai WT
                Holidays Selections , Dubai
                <hr />
                <br />
                Dubai Half Day Morning City Tour on shared transfer (Operational on
                SUN/TUE/THU/SAT) ZONE- Bur Dubai /Deira /SZR /Downtown /
                business bay / Al Barsha /Tecom
                <hr />
                <br />
                Desert Safari Tour on Sharing by 44 Vehicle with BBQ Dinner Deluxe
                Category ZONE-Bur Dubai /Deira /SZR /Downtown / business bay / Al
                Barsha /Tecom
              </td>
            </tr>
            <tr>
              <td class="day-header">Sun, Aug 4, Day 4</td>
              <td>
                Day Meals: Breakfast : Included at Sea View Hotel Bur Dubai WT
                Holidays Selections , Dubai
                <hr />
                <br />
                Dubai Frame and Museum of the Future on Private
              </td>
            </tr>
            <tr>
              <td class="day-header">Mon, Aug 5, Day 5</td>
              <td>
                Day Meals: Breakfast : Included at Sea View Hotel Bur Dubai WT
                Holidays Selections , Dubai
              </td>
            </tr>
            <tr>
              <td class="day-header">Tue, Aug 6, Day 6</td>
              <td>
                Day Meals: Breakfast : Included at Sea View Hotel Bur Dubai WT
                Holidays Selections , Dubai
                <hr />
                <br />
                Checkout from Hotel in Dubai
              </td>
            </tr> */}
          </tbody>
        </table>
        {/* <div class="headerThird">
          <p class="detailsPdf">
            <img src="/assets/images/pdf/transfer.png" width="100%" alt="car-img" />
            Hotel in Dubai to Airport
          </p>
          <p class="detailsPdf">
            <img src="/assets/images/pdf/flights.png" width="100%" alt="flight-img" />
            Departure from Dubai by IndiGo Flight 6E-1464 | Departing on 06 Aug, 08:50 PM | Arriving on 07
            Aug, 01:50 AM | Includes Check In Baggage
          </p>
        </div> */}
        {/* <div class="headerDay">
          <h2>
            Day Wise Details
            <br />
            <span> Day 1</span>
          </h2>
          <p class="date">Thu, 1 Aug 2024</p>
        </div>
        <div class="flight-section">
          <div class="flight-header">
            <h3>Flight from New Delhi to Dubai - 3h 40m</h3>
            <div class="flight-number">
              <span>6E-1461</span>
            </div>
          </div>
          <div class="flight-details">
            <div>
              <span>08:40</span>
              <span>01 Aug</span>
              <p>DEL</p>
            </div>
            <div class="icon">✈️</div>
            <div>
              <span>10:50</span>
              <span>01 Aug</span>
              <p>DXB</p>
            </div>
            <div>
              <span>Cabin: 7 Kgs</span>
              <span>Check-in: 30 Kgs</span>
            </div>
          </div>
        </div>
        <div class="transfer-section">
          <h3>Airport Transfer From Dubai Intl Airport (T1/T2/T3) to Dubai City Hotels - One Way or Vice Versa</h3>
          <div class="transfer-details">
            <img src="/assets/images/pdf/car.jpg" width="100%" alt="Private Transfer" />
            <div>
              <p>
                <strong>Private Transfer</strong>
              </p>
              <p>Transfer from Dubai Intl Airport to Dubai City Hotels (T1/T2/T3) with a private vehicle. Max 3 pax and 2 pieces of luggage.</p>
            </div>
            <div class="rating">5/5</div>
          </div>
        </div>
        <div class="hotel-section">
          <h2> Resort at Dubai</h2>
          <div class="hotel-info">
            <img src="/assets/images/pdf/hotel-pdf.jpg" alt="Sea View Hotel" />
            <div class="hotel-infoRightMain">
              <a href="#">Resort</a>
              <div class="hotel-header">
                <h3>Sea View Hotel Bur Dubai, 4 Star</h3>
                <div class="hotel-rating">★★★★☆</div>
              </div>
              <div class="hotel-infoRight">
                <div class="hotel-details">
                  <p class="bold">Resort: Bur Dubai</p>
                  <p>1.5 km from Meena Bazaar</p>
                  <p class="bold">Check-in: 01 Aug, 12 PM</p>
                  <p class="bold">Check-out: 06 Aug, 12 PM</p>
                </div>
                <div class="hotel-details2">
                  <p class="bold">Deluxe Room x1</p>
                  <p>Meal Plan: Breakfast</p>
                  <p>Room Size: 161 sq.ft</p>
                  <p>Bed Type: 1 King Bed or 2 Twin Beds</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="deluxe">
          <h2> Deluxe Room x 1</h2>
          <div class="deluxeMeal">
            <div class="deluxeInner">
              <span>Meal Plan</span>
              <p> Breakfast</p>
            </div>
            <div class="deluxeInner">
              <span>Room Size</span>
              <p> 161 sq.ft</p>
            </div>
            <div class="deluxeInner">
              <span> Bed Type</span>
              <p>
                1 King bed or 2
                Twin Bed(s)
              </p>
            </div>
          </div>
        </div>
        <div class="transfer-section2">
          <div class="fourthHeading">
            <h3>
              <img src="/assets/images/pdf/activities.png" />
              ACTIVITY • 4 Hours • In Dubai
            </h3>
            <h4 class="rating">5/5</h4>
          </div>
          <div class="transfer-details2">
            <img src="/assets/images/pdf/dubai-day-1.jpg" width="100%" alt="day1-img" />
            <div>
              <p>
                <strong>
                  Marina Dhow Cruise Tour with Dinner
                </strong>
              </p>
              <p>
                Marina Dhow Cruise Tour with Dinner on Sharing Deluxe
                Category ZONE-1 : Bur Dubai /Deira /SZR /Downtown / business
                bay
              </p>
              <p>
                &#x23F0;  Duration 4 Hours
              </p>
            </div>
          </div> */}
        {data?.pkgItinerary.map((item, i) =>
          <>
            <div class="daysSchedule">
              <div class="headerDay2">
                <h2>
                  <span> Day {i + 1}</span>
                </h2>
                <p class="date">{item.date} </p>
              </div>
              <p class="daysSchedulePara">
                &#x1F374; Day Meals &nbsp;&nbsp; &#x2705; {item.meals} :
                Selections , {item.cityname}
              </p>
            </div>
            <div class="transfer-section2">
              <div class="fourthHeading">
                <h3>
                  <img src="/assets/images/pdf/activities.png" />
                  ACTIVITY •
                </h3>
                <h4 class="rating">5/5</h4>
              </div>
              <div class="transfer-details2">
                <img src="/assets/images/pdf/dubai-day-1.jpg" width="100%" alt="day1-img" />
                <div>
                  <p>
                    <strong>
                      {item.activity}
                    </strong>
                  </p>
                  <p>{item.sight}
                  </p>
                  <p>{item.program}

                  </p>
                </div>
              </div>
            </div>
          </>
        )}
        {/* </div> */}
        {/* <div class="daysSchedule">
        <div class="headerDay2">
          <h2>
            <span> Day 3</span>
          </h2>
          <p class="date"> Sat, 3 Aug 2024</p>
        </div>
        <p class="daysSchedulePara">
          &#x1F374; Day Meals &nbsp;&nbsp; &#x2705; Breakfast : Included at Sea View Hotel Bur Dubai WT - Holidays
          Selections , Dubai
        </p>
      </div> */}
        {/* </div> */}
        <div class="transfer-section2"></div>
        {/* <div class="fourthHeading">
        <h3>
          <img src="/assets/images/pdf/activities.png" />
          ACTIVITY • 6 Hours • In Dubai
        </h3>
        <h4 class="rating">5/5</h4>
      </div>
      <div class="transfer-details2">
        <img src="/assets/images/pdf/dubai-day-1.jpg" width="100%" alt="day1-img" />
        <div>
          <p>
            <strong>
              Dubai Half-Day Morning City Tour
            </strong>
          </p>
          <p>
            Desert Safari Tour on Sharing by 4*4 Vehicle with BBQ Dinner
            Deluxe Category ZONE-1 : Bur Dubai /Deira /SZR /Downtown /
            business bay
          </p>
          <p>
            &#x23F0;  Duration 6 Hours
          </p>
        </div>
      </div> */}
        {/* <div class="daysSchedule">
        <div class="headerDay2">
          <h2>
            <span> Day 4</span>
          </h2>
          <p class="date"> Sun, 4 Aug 2024</p>
        </div>
        <p class="daysSchedulePara">
          &#x1F374; Day Meals &nbsp;&nbsp; &#x2705; Breakfast : Included at Sea View Hotel Bur Dubai WT - Holidays
          Selections , Dubai
        </p>
      </div>
      <div class="transfer-section2">
        <div class="fourthHeading">
          <h3>
            <img src="/assets/images/pdf/activities.png" />
            ACTIVITY • 8 Hours • In Dubai
          </h3>
          <h4 class="rating">5/5</h4>
        </div>
        <div class="transfer-details2">
          <img src="/assets/images/pdf/dubai-day-1.jpg" width="100%" alt="day1-img" />
          <div>
            <p>
              <strong>
                Desert Safari Tour with BBQ Dinner
              </strong>
            </p>
            <p>
              Dubai Frame + Museum of the Future on Private
            </p>
            <p>
              &#x23F0;  Duration 8 Hours
            </p>
          </div>
        </div>
        <div class="daysSchedule">
          <div class="headerDay2">
            <h2>
              <span> Day 5</span>
            </h2>
            <p class="date"> Mon, 5 Aug 2024</p>
          </div>
          <p class="daysSchedulePara">
            &#x1F374; Day Meals &nbsp;&nbsp; &#x2705; Breakfast : Included at Sea View Hotel Bur Dubai WT - Holidays
            Selections , Dubai
          </p>
        </div>
      </div>
      <div class="transfer-section2">
        <div class="fourthHeading">
          <h3>
            <img src="/assets/images/pdf/activities.png" />
            ACTIVITY • 6 Hours • In Dubai
          </h3>
          <h4 class="rating">5/5</h4>
        </div>
        <div class="transfer-details2">
          <img src="/assets/images/pdf/dubai-day-1.jpg" width="100%" alt="day1-img" />
          <div>
            <p>
              <strong>Day at leisure. Optional activities available.</strong>
            </p>
            <p></p>
            <p>
              &#x23F0;  Duration 6 Hours
            </p>
          </div>
        </div>
        <div class="daysSchedule">
          <div class="headerDay2">
            <h2>
              <span> Day 6</span>
            </h2>
            <p class="date"> Tue, 6 Aug 2024</p>
          </div>
          <p class="daysSchedulePara">
            &#x1F374; Day Meals &nbsp;&nbsp; &#x2705; Breakfast : Included at Sea View Hotel Bur Dubai WT - Holidays
            Selections , Dubai
          </p>
        </div>
      </div> */}
        <div class="iclusionExclusion">
          <div class="IE">
            <h3>Inclusions</h3>
            <ul>
              <li><span class="green-tick">&#10004;</span> Airport Transfers</li>
              <li><span class="green-tick">&#10004;</span> Hotel Accommodation with Breakfast</li>
              <li><span class="green-tick">&#10004;</span> All listed activities with transport</li>
              <li><span class="green-tick">&#10004;</span> International buffet dinners (as per activities)</li>
            </ul>
          </div>
        </div>
        <div class="iclusionExclusion">
          <div class="IE">
            <h3>Exclusions</h3>
            <ul>
              <li><span class="red-cross">&#10006;</span> Personal Expenses</li>
              <li><span class="red-cross">&#10006;</span> Alcoholic Beverages</li>
              <li><span class="red-cross">&#10006;</span> Additional optional activities</li>
            </ul>
          </div>
        </div>
        <div class="flight-section">
          <div class="flight-header">
            <h3>Flight from Dubai to New Delhi - 3h 30m</h3>
            <div class="flight-number">
              <span>6E-1461</span>
            </div>
          </div>
          <div class="flight-details">
            <div>
              <span>20:50</span>
              <span>06 Aug</span>
              <p>DXB</p>
            </div>
            <div class="icon">✈️</div>
            <div>
              <span>1:50</span>
              <span>07 Aug</span>
              <p>DEL</p>
            </div>
            <div>
              <span>Cabin: 7 Kgs</span>
              <span>Check-in: 30 Kgs</span>
            </div>
          </div>
        </div>
        <div class="transfer-section">
          <h3>Airport Transfer From Dubai Intl Airport (T1/T2/T3) to Dubai City Hotels - One Way or Vice Versa</h3>
          <div class="transfer-details">
            <img src="/assets/images/pdf/car.jpg" width="100%" alt="Private Transfer" />
            <div>
              <p>
                <strong>Private Transfer</strong>
              </p>
              <p>Transfer from Dubai Intl Airport to Dubai City Hotels (T1/T2/T3) with a private vehicle. Max 3 pax and 2 pieces of luggage.</p>
            </div>
            <div class="rating">5/5</div>
          </div>
        </div>
        <div class="creditTCS">
          <h3> Get 100% Credit of TCS Amount</h3>
          <div class="creditTCSInner">
            <div class="creditTCSInnerPart">
              <h5>TCS is collected via MMT</h5>
              <p>
                TCS credit would reflect in your
                Form 26AS on quarterly basis.
                You may also request TCS
                certificate from MMT.
              </p>
            </div>
            <div class="creditTCSInnerPart">
              <h5> Claiming your credit</h5>
              <p>
                Charged TCS can be claimed
                against the tax payable at the
                time of filing the return.
              </p>
            </div>
            <div class="creditTCSInnerPart">
              <h5> Receiving credit</h5>
              <p>
                In case there is no tax payable,
                you can claim the refund of TCS
                amount at the time of filing
                income tax return.
              </p>
            </div>
          </div>
        </div>
        <div class="headerThird">
          <h2>Visa</h2>
          <p>
            This package comes with Visa included. You will have to provide the documents required to
            process the VISA. Our agent will get in touch you post booking to initiate the Visa process.
          </p>
        </div>
        <div class="FaqPdf">
          <h4>Frequently Asked Questions for Visa</h4>
          <p> UNITED ARAB EMIRATES VISA</p>
          <div class="faqQuesMain">
            <div class="faqNo">
              <p>1.</p>
            </div>
            <div class="faqQues">
              <h6> What are the list of documents required for visa processing?</h6>
              <p>
                Below are the list of documents that needs to be uploaded:
                Colored passport front/back copies.
                Photograph with white background.
              </p>
            </div>
          </div>
          <div class="faqQuesMain">
            <div class="faqNo">
              <p>2.</p>
            </div>
            <div class="faqQues">
              <h6>Do I need to share original passport to get UAE visa?</h6>
              <p>
                No, original passport is not required for processing. Upload only soft copies of the
                documents and get your visa
              </p>
            </div>
          </div>
          <div class="faqQuesMain">
            <div class="faqNo">
              <p>3.</p>
            </div>
            <div class="faqQues">
              <h6> How long does it take to get a visa?</h6>
              <p>
                After the submission at embassy, it usually takes 2-3 working days. Please note no visas are
                processed on Friday and Saturday.
              </p>
            </div>
          </div>
          <div class="faqQuesMain">
            <div class="faqNo">
              <p>4.</p>
            </div>
            <div class="faqQues">
              <h6>What is visa validity and how long can I stay in UAE?</h6>
              <p>
                Validity is the time period in which you have to enter UAE. Once you enter, you can stay in
                UAE for a max of 30 or 90 days basis the visa type selected.
              </p>
            </div>
          </div>
          <div class="faqQuesMain">
            <div class="faqNo">
              <p>5.</p>
            </div>
            <div class="faqQues">
              <h6> Is Okay to Board included in the fees?</h6>
              <p>We are not charging any fee for OTB, it’s an complimentary service provided by MMT.</p>
            </div>
          </div>
          <div class="faqQuesMain">
            <div class="faqNo">
              <p>6.</p>
            </div>
            <div class="faqQues">
              <h6> When will MakeMyTrip process OTB?</h6>
              <p>
                If Okay to Board is required, we will send the request to airline once your visa is approved.
                Please note that airlines usually approves Okay To Board 24 hours before departure.
              </p>
            </div>
          </div>
          <div class="faqQuesMain">
            <div class="faqNo">
              <p>7.</p>
            </div>
            <div class="faqQues">
              <h6> When will airline Approve Okay to Board</h6>
              <p>Airline usually approves OTB 24 hours before departure.</p>
            </div>
          </div>
          <div class="faqQuesMain">
            <div class="faqNo">
              <p>8.</p>
            </div>
            <div class="faqQues">
              <h6> What all documents are required at Immigration?</h6>
              <p>
                Below are the list of documents required at immigration: - Original passport. - Print out of
                your e-visa.
              </p>
            </div>
          </div>
          <div class="faqQuesMain">
            <div class="faqNo">
              <p>9.</p>
            </div>
            <div class="faqQues">
              <h6>Does every Indian National travelling to UAE need visa?</h6>
              <p> Visa is required for all except if you have a valid US visa.</p>
            </div>
          </div>
          <div class="faqQuesMain">
            <div class="faqNo">
              <p>10.</p>
            </div>
            <div class="faqQues">
              <h6> Can I travel to Abu Dhabi on UAE visa.?</h6>
              <p>  “Yes, this visa is valid for Abu Dhabi.”</p>
            </div>
          </div>
        </div>
        <div class="headerThird">
          <h2>Policies</h2>
          {data.policy.map(item => (<>
            <li>{item.policytitle}</li>
            <p>{item.po}</p>
          </>
          ))}
        </div>
        <div class="headerThird">
          <h2>Exclusions</h2>
          <ul>
            <li> Mandatory Dubai Tourism Dirham Fee to be paid directly to the hotel (subject to change basis local regulations)</li>
            <li> Package price does not include Gala dinner charges applicable on Christmas and New Year's Eve</li>
          </ul>
        </div>
        <div class="headerThird">
          <h2> Terms and Conditions</h2>
          <ul>
            <li>
              Tourism Dirham Tax will be charged directly to the clients upon arrival at the hotel from 31.03.14 onwards which is
              applicable for all bookings. These charges are on per night basis based on the hotel category booked.
            </li>
            <li>
              Please note that once your booking is confirmed, you will receive an e-mail as well as an SMS on your registered
              mobile number confirming your booking. However, if you would like to get in touch with us please call us on 0124
              4859749. We are open from 8:00 am to 8:00 pm, seven days a week.
            </li>
            <li>
              Please expect to receive your vouchers 72 hours before your departure date (subject to full payment of your package
              cost)
            </li>
            <li>
              Please note that these packages are customizable, which means that you will be able to make changes to the
              itinerary/activity if you so desire. The final payment will be calculated as per the activities reflecting on the website
              which will be outlined in the confirmatory e-mail sent to you.
            </li>
            <li>
              Personal expenses such as laundry, telephone calls, room service, alcoholic beverages, mini bar etc., are not included.
            </li>
            <li>
              In case your package needs to be cancelled due to any natural calamity, weather conditions etc. MakeMyTrip shall
              strive to give you the maximum possible refund subject to the agreement made with our trade partners/vendors.
            </li>
            <li>
              If payment is not made as per the schedule provided in the first booking confirmation e-mail, MakeMyTrip reserves
              the right to cancel the booking after attempting to get in touch with you. Refunds would be as per the package
              cancellation policy.
            </li>
            <li>
              The passenger names in the booking form should be exactly as per passports. MakeMyTrip will not bear any liability
              for the name change fee, if incorrect names and ages have been added at the time of booking.
            </li>
            <li>
              Please note that if your package includes a flight which is a low cost carrier (Air Asia, Scoot Airlines, Air Arabia, Jetstar,
              Fly Dubai, Thai AirAsia, Air India Express, Tiger Airways) then baggage will not be included in the package. Baggage
              can be added as per your requirement at an additional cost depending on the airlines and destination. Our Travel
              Expert will attempt to get in touch with you within 24-hours after the booking has been confirmed for baggage
              addition.
            </li>
            <li> Please ensure that baggage requirements are given to our Travel Expert latest by 5 days before the date of departure.</li>
            <li>
              Standard check-in time at the hotel is normally 2:00 pm and check-out is 11:00 am. An early check-in, or a late check
              out is solely based on the discretion of the hotel.
            </li>
            <li>
              In case the selected hotel is unavailable for booking, an alternate arrangement will be offered to the customer in
              another hotel of a similar category.
            </li>
            <li>
              Certain hotels abroad may ask for a security deposit during check-in, which is refundable at check-out subject to the
              hotels policy
            </li>
            <li> Please note that Day at Leisure essentially implies that no sightseeing activities have been included for that day</li>
            <li> Kindly be on time for your activities, tours and transfers. Most countries are quite strict about following a schedule</li>
            <li>
              The package price does not include special dinner or mandatory charges at time levied by the hotels especially during
              New Year and Christmas or any special occasions. MakeMyTrip shall try to communicate the same while booking the
              package. However MakeMyTrip may not have this information readily available all the time.
            </li>
            <li> For queries regarding cancellations and refunds, please refer to our Cancellation Policy.</li>
            <li> Disputes, if any, shall be subject to the exclusive jurisdiction of the courts in New Delhi.</li>
            <li>
              For any paid activity which is non-operational due to any unforeseen reason, we will process refund & same should
              reach the guest within 30 days of processing the refund. Also, for any activity which is complimentary and not charged
              to MMT & guest, no refund will be processed.
            </li>
            <li>
              Tourism Dirham Tax will be charged directly to the clients upon arrival at the hotel from 31.03.14 onwards which is
              applicable for all new and existing bookings.
            </li>
            <span class="tcsCondition">TCS Conditions</span>
            <li>
              As per section 206CCA of Income Tax Act 1961, w.e.f. 01-Jul-21 onwards, TCS will be charged @5% on overseas tour
              packages in case you have not filed your income tax returns for two preceding years; and the aggregate TDS and TCS
              is each tax year is INR 50,000 or more. - On validating the PAN if it is found that you have not filed your Income Tax
              Returns for two preceding years and aggregate TCS and TCS exceeds INR 50,000, an additional TCS @5% will be
              recovered from you or booking will get cancelled and cancellation charges will apply.
            </li>
          </ul>
        </div>
        <div class="headerThird">
          <h2>How to Book</h2>
        </div>
        <div class="payOnlinePdf">
          <div>
            <strong>Pay Online</strong>
            <br />
            {/* <a href="#">https://app.mmt.com/Xm2V/oqxkzmst</a> */}
          </div>
          <div>
            <strong>Contact Travel Expert</strong>
            <br />
            {user.name} {user.mname} {user.lname}
            <br />
            <a href="tel:9311300245">{user.email}</a>
          </div>
        </div>
        <div class="pay-now">
          <a href="#">Pay Now</a>
        </div>
        <div class="payment-schedule">
          <div class="paymentOption">
            <h2>Payment Options & Schedule</h2>
            <h3 class="highlight">₹ {data.query?.totalCost}</h3>
          </div>

          <table>
            <thead>
              <tr>
                <th>Payment Options</th>
                <th>Date</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Full</td>
                <td>Due now</td>
                <td>{data.query?.totalCost}</td>
              </tr>
            </tbody>
          </table>
          <p>Note: Package price, payment schedule and cancellation policy are tentative and subject to
            change. Package price, payment schedule and cancellation policy as shown on the Package
            Review Page prior to the payment will be final</p>
        </div>
        <div class="cancel-policy">
          <h2>Cancellation and Refund</h2>
          <div class="policy-bar">
            <div class="status">
              <span>Your Current Policy</span>
              <p>
                After Booking -
                <span class="non-refundable">Non-Refundable</span>
              </p>
            </div>
            <p>Cancellation is not allowed.</p>
          </div>
        </div>

        <div class="cancel-policy">
          <h2>Data Change Policy</h2>
          <div class="policy-bar">
            <div class="status">
              <span>Your Current Policy</span>
              <p>
                After Booking -
                <span class="non-refundable">Non-Refundable</span>
              </p>
            </div>
            <p>Data Change is not allowed.</p>
          </div>
        </div>
        <div class="headerThird">
          <h2>Get in touch</h2>
        </div>
        <div class="getIntochSecPDF">
          <div class="getIntochSecPDFLeft">
            <h5>
              Curated by
              <br />
              <span>{user.name} {user.mname} {user.lname}</span>
            </h5>
          </div>
          <div class="getIntochSecPDFRight">
            <p>
              Call:
              <span>{user.mobnumber}</span>
            </p>
            <p>
              Email:
              <span>{user.email}</span>
            </p>
          </div>
        </div>
        <div class="getIntochSecPDF">
          <p>
            This is an initial quote based on our most popular holiday package to your chosen destination. The pricing is
            indicative and can change depending on hotels etc. chosen. Once your Travel Expert gets in touch with you,
            feel free to ask for any customisation in this itinerary or have a fresh itinerary designed, as per your
            preference. When you are making the booking, please do check that all the selected package inclusions are
            showing on the package review page and confirm that all elements including flights, hotels and sightseeing
            are exactly as finalised by you.
          </p>
        </div>
      </div>
      {/* </div> */}

      <hr />

      <div className='mb-6 p-4 rounded-t-none flex justify-between gap-4 bg-slate-200'>

        <button
          onClick={generatePDF}
          className="w-full bg-red-500 text-white border-transparent  py-2 px-4 rounded-lg hover:bg-white hover:text-red-500
          hover:border-red-500 border-2"
        >
          Generate PDF
        </button>
        <button
          onClick={() => isModalOpen(false)}
          className="w-full text-white py-2 px-4 rounded-lg border-2 border-transparent bg-gray-600 hover:text-gray-600 hover:border-gray-600 hover:bg-white"
        >
          Close
        </button>
      </div>
    </>

  )
}

export default PdfFile;