import Head from "@src/components/Head";
import resolvePath from "@src/utils/resolvePath";
import appConfig from "@src/config/app";
import { useTranslation, defaultLocale } from "@src/i18n";

const translateConfig = (appConfig, locale) => {
  if (!locale || locale === defaultLocale) {
    return appConfig
  }
  // Replace config with lang
  const configLang = appConfig.lang[locale]
  if (configLang === undefined) {
    throw new Error("invalid locale: ", locale)
  }
  return { ...appConfig, ...configLang }
}

const ShowInvite = ({ currentUrl, guestListLastUpdatedAt, guest }) => {
  const t = useTranslation(guest.locale)

  // Initiate config variables
  const { logo, ogTags, coupleInfo, venue, weddingDay, weddingDate, weddingTime, calendarInfo } = translateConfig(appConfig, guest.locale)
  const { brideName, groomName, coupleNameFormat } = coupleInfo

  const coupleNameStr = coupleNameFormat === 'GROOM_FIRST'
    ? `${groomName} & ${brideName}`
    : `${brideName} & ${groomName}`
  const coupleName = coupleNameFormat === 'GROOM_FIRST'
    ? (<>{groomName} <span>&amp;</span> {brideName}</>)
    : (<>{brideName} <span>&amp;</span> {groomName}</>)

  // Venue info
  const venueBrief = `${venue.name}, ${venue.city}, ${venue.country}`
  const weddingDateBrief = `${weddingDay}, ${weddingDate}`

  // Event info
  const eventTitle = `${coupleNameStr}'s Wedding`
  let eventDescription = `${weddingDateBrief} at ${venue.name}, ${venue.city}`
  if (guest.name) {
    eventDescription = `Dear ${guest.name}, you are cordially invited to our wedding on ${weddingDate} at ${venue.name}. Looking forward to seeing you!`
  }

  // Calendar payload
  const calendarEvent = {
    title: eventTitle,
    description: eventDescription,
    location: `${venue.city}, ${venue.country}`,
    startTime: calendarInfo.timeStartISO,
    endTime: calendarInfo.timeEndISO
  }

  return (
    <div>
      <style jsx global>{`
      a.react-add-to-calendar__button span {
        cursor: pointer;
        text-decoration: underline;
      }
      `}
      </style>
      <Head {...ogTags}
        title={eventTitle}
        description={eventDescription}
        guestName={guest.name}
        url={currentUrl}
        date={weddingDateBrief}
        modifiedTime={guestListLastUpdatedAt}
        venue={venueBrief}
        logo={resolvePath(ogTags.logo)}
        author={resolvePath('/')}
      />
      < section className="header_area">
        <div
          id="home"
          className="header_slider"
        >
          <div className="slick-list draggable">
            <div className="slick-track" style={{ opacity: 1 }}>
              <div
                className="single_slider bg_cover d-flex align-items-center"
                style={{
                  height: '100vh'
                }}
              >
                <div className="container">
                  <div className="row justify-content-center">
                    <div className="col-lg-12">
                      <div className="slider_content text-center" style={{ paddingTop: 0 }}>
                        <img style={{ maxHeight: 120, margin: 0, marginTop: 0 }} src={logo.headerLogo} alt="logo" />
                        <h5
                          className="slider_sub_title"
                          data-animation="fadeInUp"
                          data-delay="0.2s"
                          style={{ animationDelay: '0.2s' }}
                        >{t('siteIntro')}</h5>
                        <h2
                          className="slider_title"
                          data-animation="fadeInUp"
                          data-delay="0.7s"
                          style={{ animationDelay: '0.7s' }}
                        >
                          {coupleName}
                        </h2>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div >
  )
};

ShowInvite.getInitialProps = (ctx) => {
  const localeParams = ctx.query.lang || defaultLocale
  const emptyGuestParams = {
    guest: {
      guestId: '',
      name: '',
      greeting: '',
      locale: localeParams,
    }
  }

  const currentUrl = resolvePath(ctx.req.url)
  const guestId = ctx.query.u
  if (!guestId) {
    return {
      currentUrl,
      ...emptyGuestParams
    }
  }

  const guestData = guestList.data
  const guestListLastUpdatedAt = guestList.meta.lastUpdatedAt
  const { name, greeting, locale } = guestData.filter(guest => guest.guestId === guestId)[0] || {}
  if (!name) {
    return {
      currentUrl,
      ...emptyGuestParams
    }
  }

  return {
    currentUrl,
    guestListLastUpdatedAt,
    guest: {
      name,
      greeting,
      guestId,
      locale: locale || localeParams,
    }
  }
}

export default ShowInvite