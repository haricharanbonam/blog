export const clientTimelineTemplate = (
  eventData,
  timelineEntry,
  studioOwner,
  clientName
) => {
  const { eventTitle, eventType, description, location, dateRange } = eventData;
  const {
    name,
    studioName,
    studioLogo,
    profilePicture,
    contactNumber,
    studioContactNumber,
    email,
    address,
    studioWebsite,
  } = studioOwner;

  const {
    title,
    description: timelineDescription,
    completedAt,
  } = timelineEntry;

  // Date formatting functions
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Use studio contact number if available, otherwise fall back to owner's contact
  const displayContactNumber = studioContactNumber || contactNumber;

  // Format address for display
  const formatAddress = (addr) => {
    if (!addr) return "";
    const parts = [addr.street, addr.city, addr.state, addr.zipCode].filter(
      Boolean
    );
    return parts.join(", ");
  };

  const displayAddress = formatAddress(address);
  const displayLogo = studioLogo || profilePicture;

  const { startDate, endDate } = dateRange || {};

  const formattedDate = startDate
    ? formatDate(startDate) +
      (endDate && startDate !== endDate ? ` - ${formatDate(endDate)}` : "")
    : "No Date Provided";

  const formattedTime = startDate ? formatTime(startDate) : "No Time Provided";

  return {
    subject: `Event Update: ${title} - ${eventTitle}`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Plexis Email</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333333; background-color: #f8f9fa;">
    
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);">
        
<tr>
  <td style="background: linear-gradient(135deg, #8B5FBF 0%, #6A4C93 50%, #4C956C 100%); padding: 30px 40px; text-align: center; position: relative;">
    
    <!-- Main content -->
    <div style="position: relative; z-index: 2;">
      ${
        displayLogo
          ? `
        <img src="${displayLogo}" alt="${studioName}" 
          style="width: 70px; height: 70px; border-radius: 50%; object-fit: cover;
                 border: 3px solid #ffffff; margin: 0 auto 15px auto; display: block;
                 box-shadow: 0 4px 12px rgba(0,0,0,0.2);">
      `
          : ""
      }
      
      <div style="color:#ffffff; font-size:24px; font-weight:700; margin-bottom:6px; text-shadow:0 2px 4px rgba(0,0,0,0.3);">
        ${studioName}
      </div>
      
      <div style="color:#ffffff; font-size:14px; font-weight:300; margin-bottom:15px; opacity:0.9;">
        Managed by ${name}
      </div>
      
      <div style="height:2px; background: linear-gradient(90deg, #8B5FBF, #6A4C93, #4C956C); margin-top:15px;"></div>
    </div>
    
    <!-- Powered by Plexis (bottom-right corner) -->
<table align="right" border="0" cellspacing="0" cellpadding="0" style="margin-top:10px;">
  <tr>

    <td style="font-size:10px; color:#ffffff; opacity:0.7; font-family:Arial, sans-serif;">
      Powered by Plexis
    </td>
  </tr>
</table>

    
  </td>
</tr>

        
        <tr>
            <td style="padding: 0; background: linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%);">
                
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                        <td style="background: transparent; padding: 40px; text-align: center;">
                            <div style="font-size: 18px; color: #444; margin-bottom: 12px; font-weight: 400;">Hello,</div>
                            <div style="font-size: 26px; font-weight: 700; color: #8B5FBF; margin: 8px 0 20px 0; text-transform: uppercase; letter-spacing: 1px;">${clientName}</div>
                            <div style="font-size: 16px; color: #666; line-height: 1.5; max-width: 500px; margin: 0 auto;"><strong>Great News!</strong> We have an important update regarding your event. Your event preparation is progressing smoothly, and we wanted to keep you informed of our latest milestone.</div>
                        </td>
                    </tr>
                </table>
                
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                        <td style="padding: 40px 20px; max-width: 600px; margin: 0 auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">
                            <h2 style="text-align: center; color: #4a5568; font-size: 28px; font-weight: 700; margin: 0 0 10px 0; letter-spacing: -0.5px;">Event Update</h2>
                            
<table align="center" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 40px auto;">
  <tr>
    <td style="width:80px; height:4px; background-color:#8b5cf6; border-radius:2px; line-height:0; font-size:0;">
      &nbsp;
    </td>
  </tr>
</table>

                            <!-- Event Update Section -->
                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(6, 182, 212, 0.08) 100%); border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.08), 0 0 0 1px rgba(16, 185, 129, 0.1); overflow: hidden; border: 1px solid #f1f5f9; margin-bottom: 30px;">
                                <tr>
                                    <td style="padding: 35px 40px; text-align: center;">
                                        <div style="margin-bottom: 20px;">
                                            <span style="font-size: 48px;">✅</span>
                                        </div>
                                        <div style="color: #10b981; font-size: 24px; font-weight: 800; margin: 0 0 15px 0; letter-spacing: -0.5px; line-height: 1.2;">${title}</div>
                                        <div style="color: #4b5563; font-size: 16px; line-height: 1.6; max-width: 480px; margin: 0 auto 20px auto;">
                                            ${timelineDescription}
                                        </div>
                                        <div style="background: rgba(16, 185, 129, 0.1); padding: 15px 25px; border-radius: 12px; margin-top: 20px; border: 1px solid rgba(16, 185, 129, 0.2);">
                                            <div style="color: #10b981; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 8px;">COMPLETED ON</div>
                                            <div style="color: #1f2937; font-size: 16px; font-weight: 700;">${formatDate(
                                              completedAt
                                            )} at ${formatTime(
      completedAt
    )}</div>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                            
                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #ffffff; border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.08), 0 0 0 1px rgba(139, 92, 246, 0.1); overflow: hidden; border: 1px solid #f1f5f9;">
                                
                                <tr>
                                    <td style="padding: 40px 40px 30px 40px; text-align: center; background: linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(99, 102, 241, 0.05) 100%); border-bottom: 1px solid #f1f5f9;">
                                        <div style="color: #8b5cf6; font-size: 32px; font-weight: 800; margin: 0 0 20px 0; letter-spacing: -1px; line-height: 1.1;">${eventTitle}</div>
                                        <div style="margin-top: 15px;">
                                            <span style="background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%); color: #ffffff; padding: 12px 28px; border-radius: 25px; font-size: 13px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; box-shadow: 0 8px 20px rgba(139, 92, 246, 0.25); display: inline-block;">${eventType}</span>
                                        </div>
                                    </td>
                                </tr>
                                
                                <tr>
                                    <td>
                                        <table style="width: 100%; border-collapse: collapse; margin: 0;" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td style="width: 50%; padding: 30px 25px; vertical-align: top; border-right: 1px solid #f1f5f9; height: 180px;">
                                                    <table style="background: linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(99, 102, 241, 0.08) 100%); padding: 25px; border-radius: 16px; border: 1px solid rgba(139, 92, 246, 0.1); height: 100%; box-sizing: border-box; width: 100%;" cellpadding="0" cellspacing="0">
                                                        <tr>
                                                            <td style="vertical-align: middle; text-align: center;">
                                                                <div style="margin-bottom: 15px;">
                                                                    <span style="font-size: 28px;">📅</span>
                                                                </div>
                                                                <div style="color: #8b5cf6; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 12px;">EVENT DATE & TIME</div>
                                                                <div style="color: #1f2937; font-size: 16px; font-weight: 700; line-height: 1.3; margin-bottom: 8px;">${formattedDate}</div>
                                                                <div style="color: #8b5cf6; font-size: 20px; font-weight: 800; text-shadow: 0 2px 8px rgba(139, 92, 246, 0.2);">${formattedTime}</div>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                                <td style="width: 50%; padding: 30px 25px; vertical-align: top; height: 180px;">
                                                    <table style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(6, 182, 212, 0.08) 100%); padding: 25px; border-radius: 16px; border: 1px solid rgba(16, 185, 129, 0.1); height: 100%; box-sizing: border-box; width: 100%;" cellpadding="0" cellspacing="0">
                                                        <tr>
                                                            <td style="vertical-align: middle; text-align: center;">
                                                                <div style="margin-bottom: 15px;">
                                                                    <span style="font-size: 28px;">📍</span>
                                                                </div>
                                                                <div style="color: #10b981; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 12px;">LOCATION</div>
                                                                <div style="color: #1f2937; font-size: 18px; font-weight: 700; line-height: 1.3;">${
                                                                  location ||
                                                                  "Location to be confirmed"
                                                                }</div>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                
                                ${
                                  description
                                    ? `
                                <tr>
                                    <td style="padding: 35px 40px; background: linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(249, 115, 22, 0.05) 100%); border-top: 1px solid #f1f5f9;">
                                        <table style="background: rgba(255, 255, 255, 0.8); padding: 30px; border-radius: 16px; border: 2px dashed rgba(245, 158, 11, 0.2); width: 100%;" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td style="text-align: center;">
                                                    <div style="margin-bottom: 15px;">
                                                        <span style="font-size: 32px;">📋</span>
                                                    </div>
                                                    <div style="color: #f59e0b; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 15px;">SPECIAL INSTRUCTIONS</div>
                                                    <div style="color: #4b5563; font-size: 15px; line-height: 1.7; max-width: 480px; margin: 0 auto;">
                                                        ${description}
                                                    </div>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                `
                                    : ""
                                }
                            </table>
                            
                            <table style="background: #f8fafc; border-radius: 16px; padding: 30px; margin: 30px 0; border: 1px solid #e2e8f0; width: 100%;" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="text-align: center;">
                                        <div style="color: #10b981; font-size: 18px; font-weight: 700; margin-bottom: 12px;">What's Next?</div>
                                        <div style="color: #64748b; font-size: 14px; line-height: 1.6; max-width: 500px; margin: 0 auto;">
                                            We're making excellent progress on your event! Our team continues to work diligently to ensure everything is perfect for your special day. We'll keep you updated as we reach more milestones.
                                        </div>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Action Button -->
                            <table style="margin: 35px auto 0 auto;" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td style="background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%); border-radius: 12px; padding: 16px 40px; box-shadow: 0 12px 28px rgba(139, 92, 246, 0.3); border: 1px solid rgba(255,255,255,0.1);">
                                        <a href="#" style="color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 700; letter-spacing: 0.5px; text-shadow: 0 1px 2px rgba(0,0,0,0.1);">View Full Progress</a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
                
<table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
        <td style="background: transparent; padding: 35px 40px;">
            <div style="font-size: 18px; font-weight: 700; color: #2c3e50; text-align: center; margin-bottom: 30px; position: relative;">
                Get in Touch
                <div style="position: absolute; bottom: -8px; left: 50%; transform: translateX(-50%); width: 60px; height: 3px; background: linear-gradient(90deg, #8B5FBF, #6A4C93); border-radius: 2px;"></div>
            </div>
            
            <table style="width: 100%; max-width: 500px; margin: 0 auto; border-collapse: collapse;" cellpadding="0" cellspacing="0">
                <!-- Email Row -->
                <tr>
                    <td style="padding: 8px;">
                        <table style="background: white; padding: 20px; border-radius: 12px; text-align: center; border: 2px solid #8B5FBF; box-shadow: 0 4px 15px rgba(139, 95, 191, 0.1); width: 100%;" cellpadding="0" cellspacing="0">
                            <tr>
                                <td>
                                    <svg style="width: 24px; height: 24px; margin: 0 auto 10px auto; display: block;" viewBox="0 0 24 24" fill="#8B5FBF">
                                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                                    </svg>
                                    <div style="font-size: 12px; font-weight: 700; color: #8B5FBF; text-transform: uppercase; margin-bottom: 8px; letter-spacing: 1px;">Email</div>
                                    <div style="font-size: 14px; color: #2c3e50; font-weight: 600; line-height: 1.4;"><a href="mailto:${email}" style="color: #8B5FBF; text-decoration: none;">${email}</a></div>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                
                <!-- Phone Row (if displayContactNumber exists) -->
                <tr>
                    <td style="padding: 8px;">
                        <table style="background: white; padding: 20px; border-radius: 12px; text-align: center; border: 2px solid #8B5FBF; box-shadow: 0 4px 15px rgba(139, 95, 191, 0.1); width: 100%;" cellpadding="0" cellspacing="0">
                            <tr>
                                <td>
                                    <svg style="width: 24px; height: 24px; margin: 0 auto 10px auto; display: block;" viewBox="0 0 24 24" fill="#8B5FBF">
                                        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                                    </svg>
                                    <div style="font-size: 12px; font-weight: 700; color: #8B5FBF; text-transform: uppercase; margin-bottom: 8px; letter-spacing: 1px;">Phone</div>
                                    <div style="font-size: 14px; color: #2c3e50; font-weight: 600; line-height: 1.4;">${displayContactNumber}</div>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                
                <!-- Address Row (if displayAddress exists) -->
                <tr>
                    <td style="padding: 8px;">
                        <table style="background: white; padding: 20px; border-radius: 12px; text-align: center; border: 2px solid #8B5FBF; box-shadow: 0 4px 15px rgba(139, 95, 191, 0.1); width: 100%;" cellpadding="0" cellspacing="0">
                            <tr>
                                <td>
                                    <svg style="width: 24px; height: 24px; margin: 0 auto 10px auto; display: block;" viewBox="0 0 24 24" fill="#8B5FBF">
                                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                                    </svg>
                                    <div style="font-size: 12px; font-weight: 700; color: #8B5FBF; text-transform: uppercase; margin-bottom: 8px; letter-spacing: 1px;">Address</div>
                                    <div style="font-size: 14px; color: #2c3e50; font-weight: 600; line-height: 1.4;">${displayAddress}</div>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                
                <!-- Website Row (if studioWebsite exists) -->
                <tr>
                    <td style="padding: 8px;">
                        <table style="background: white; padding: 20px; border-radius: 12px; text-align: center; border: 2px solid #8B5FBF; box-shadow: 0 4px 15px rgba(139, 95, 191, 0.1); width: 100%;" cellpadding="0" cellspacing="0">
                            <tr>
                                <td>
                                    <svg style="width: 24px; height: 24px; margin: 0 auto 10px auto; display: block;" viewBox="0 0 24 24" fill="#8B5FBF">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                    </svg>
                                    <div style="font-size: 12px; font-weight: 700; color: #8B5FBF; text-transform: uppercase; margin-bottom: 8px; letter-spacing: 1px;">Website</div>
                                    <div style="font-size: 14px; color: #2c3e50; font-weight: 600; line-height: 1.4;"><a href="${studioWebsite}" style="color: #8B5FBF; text-decoration: none;">${studioWebsite}</a></div>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
            </td>
        </tr>
        
        <tr>
            <td style="background: linear-gradient(135deg, #2D1B4E 0%, #1A0B2E 100%); color: #ffffff; padding: 40px;">
                
                <!-- Footer Content -->
                <table style="width: 100%; border-collapse: collapse;" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="width: 33.33%; padding: 15px; vertical-align: top;">
                            <div style="color: #B794F6; font-size: 16px; font-weight: 600; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 0.5px;">Quick Links</div>
                            <div style="color: #E2E8F0; font-size: 14px; line-height: 1.8;">
                                <div style="margin-bottom: 8px;"><a href="https://www.plexis.in" style="color: #E2E8F0; text-decoration: none;">Visit Website</a></div>
                                <div style="margin-bottom: 8px;"><a href="https://www.plexis.in/explorestudios" style="color: #E2E8F0; text-decoration: none;">Dashboard</a></div>
                                <div style="margin-bottom: 8px;"><a href="https://www.plexis.in/our-story/" style="color: #E2E8F0; text-decoration: none;">Our Story</a></div>
                                <div style="margin-bottom: 8px;"><a href="https://www.plexis.in/" style="color: #E2E8F0; text-decoration: none;">Features</a></div>
                            </div>
                        </td>
                        <td style="width: 33.33%; padding: 15px; vertical-align: top;">
                            <div style="color: #B794F6; font-size: 16px; font-weight: 600; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 0.5px;">Contact Us</div>
                            <div style="color: #E2E8F0; font-size: 14px; line-height: 1.8;">
                                <div><strong style="color: #B794F6;">Email:</strong> hiplexis@gmail.com</div>
                                <div><strong style="color: #B794F6;">Phone:</strong> +91 96661 55020</div>
                                <div><strong style="color: #B794F6;">Address:</strong> Gachibowli, Hyderabad, 500032</div>
                            </div>
                        </td>
                        <td style="width: 33.33%; padding: 15px; vertical-align: top;">
                            <div style="color: #B794F6; font-size: 16px; font-weight: 600; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 0.5px;">Legal</div>
                            <div style="color: #E2E8F0; font-size: 14px; line-height: 1.8;">
                                <div style="margin-bottom: 8px;"><a href="https://www.plexis.in/privacy" style="color: #E2E8F0; text-decoration: none;">Privacy Policy</a></div>
                                <div style="margin-bottom: 8px;"><a href="https://www.plexis.in/terms" style="color: #E2E8F0; text-decoration: none;">Terms & Conditions</a></div>
                                <div style="margin-bottom: 8px;"><a href="mailto:hiplexis@gmail.com" style="color: #E2E8F0; text-decoration: none;">Contact Support</a></div>
                            </div>
                        </td>
                    </tr>
                </table>
                
                <div style="height: 1px; background: linear-gradient(90deg, transparent, #B794F6, transparent); margin: 30px 0;"></div>
                
                <table style="width: 100%;" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="text-align: center; padding-top: 20px;">
                            
                            <!-- Social Media -->
                            <div style="text-align: center; margin: 20px 0;">
                                <a href="https://facebook.com/plexis" style="display: inline-block; width: 40px; height: 40px; margin: 0 8px; border-radius: 50%; background: rgba(255, 255, 255, 0.1); text-align: center; vertical-align: middle; text-decoration: none;">
                                    <svg style="width: 18px; height: 18px; fill: white; margin-top: 11px;" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                                </a>
                                <a href="https://twitter.com/plexis" style="display: inline-block; width: 40px; height: 40px; margin: 0 8px; border-radius: 50%; background: rgba(255, 255, 255, 0.1); text-align: center; vertical-align: middle; text-decoration: none;">
                                    <svg style="width: 18px; height: 18px; fill: white; margin-top: 11px;" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                                </a>
                                <a href="https://instagram.com/plexis" style="display: inline-block; width: 40px; height: 40px; margin: 0 8px; border-radius: 50%; background: rgba(255, 255, 255, 0.1); text-align: center; vertical-align: middle; text-decoration: none;">
                                    <svg style="width: 18px; height: 18px; fill: white; margin-top: 11px;" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                                </a>
                                <a href="https://linkedin.com/company/plexis" style="display: inline-block; width: 40px; height: 40px; margin: 0 8px; border-radius: 50%; background: rgba(255, 255, 255, 0.1); text-align: center; vertical-align: middle; text-decoration: none;">
                                    <svg style="width: 18px; height: 18px; fill: white; margin-top: 11px;" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                                </a>
                            </div>
                            
                            <div style="color: #E2E8F0; font-size: 14px; font-style: italic; margin-bottom: 15px;">
                                "Thank you for being part of the Plexis community!"
                            </div>
                            
                            <div style="color: #A0AEC0; font-size: 13px; margin-bottom: 10px;">
                                © 2025 GZG Tech Solutions. All rights reserved.
                            </div>
                            
                            <div style="text-align: right; margin-top: 15px;">
                                <a href="https://www.plexis.in" style="text-decoration: none; color: #B794F6; font-size: 10px; opacity: 0.7;">
                                    Powered by Plexis
                                </a>
                            </div>
                            
                            <div style="text-align: center; margin-top: 15px;">
                                <a href="#" style="color: #B794F6; text-decoration: none; font-size: 12px; opacity: 0.8;">Unsubscribe from these emails</a>
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        
    </table>
</body>
</html>
        `,
  };
};