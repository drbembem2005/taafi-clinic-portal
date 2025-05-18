
# Doctor Images Integration Guide

This guide explains where and how doctor images are displayed in the application.

## Image Storage

Doctor images should be hosted on a publicly accessible URL. The application expects a valid image URL in the `image` property of the doctor object.

## Image Display Locations

Doctor images appear in multiple places throughout the application:

1. **Doctor Cards on Doctors Page**
   - A rounded image display on the left side of each doctor card
   - Default placeholder shown if no image is available (user icon)
   - Image size: 128x128px (desktop), 96x96px (mobile)

2. **Doctor Card Detail Popup**
   - A rounded image in the header section of the doctor details dialog
   - Default placeholder shown if no image is available
   - Image size: 80x80px (desktop), 64x64px (mobile)

3. **Booking Wizard - Doctor Selection Step**
   - Smaller thumbnail in the doctor selection cards
   - Default placeholder shown if no image is available
   - Image size: 96x96px

4. **Booking Confirmation**
   - Small avatar representing the selected doctor
   - Default placeholder shown if no image is available
   - Image size: 48x48px

## Image Format Requirements

- **Recommended format:** Square aspect ratio images (1:1)
- **Recommended resolution:** At least 300x300px
- **Supported formats:** JPG, PNG, WebP
- **Maximum file size:** 2MB

## Implementation Details

The application handles doctor images in the following components:

1. `DoctorCard.tsx` - Main doctor card component that displays doctor information and image
2. `DoctorSelection.tsx` - Component for selecting doctors in the booking wizard
3. `BookingConfirmation.tsx` - Final confirmation step showing selected doctor with image

If no image is available (`doctor.image` is null or empty), the application automatically displays a placeholder icon instead.

## Adding Doctor Images

To add images to doctors in the system:

1. Upload the doctor's image to a hosting service
2. Update the doctor's record in the database with the image URL in the `image` field
3. The application will automatically display the image in all relevant places

For best visual results, use professional headshot photos with square aspect ratio and good lighting.
