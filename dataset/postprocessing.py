import cv2
import numpy as np

img = cv2.imread('dataset/img/14.png')
blurred = cv2.GaussianBlur(img,(15,15),0)
# cv2.imshow('img', blurred)
# cv2.waitKey(10000)

cv2.imwrite('img.png', blurred)

size = 7

# generating the kernel
kernel_motion_blur = np.zeros((size, size))
kernel_motion_blur[int((size-1)/2), :] = np.ones(size)
kernel_motion_blur = np.eye(size)
kernel_motion_blur = kernel_motion_blur / size
print(kernel_motion_blur)

# applying the kernel to the input image
output = cv2.filter2D(img, -1, kernel_motion_blur)
cv2.imwrite('img_motion.png', output)


import math

# img = cv2.imread('images/input.jpg', cv2.IMREAD_GRAYSCALE)
rows, cols, dim = img.shape

#####################
# Vertical wave

# img_output = np.zeros(img.shape, dtype=img.dtype)
#
# for i in range(rows):
#     for j in range(cols):
#         # offset_x = int(125.0 * math.sin(0.01*2 * 3.14 * i / 180))
#         offset_x = int(125.0 * math.atan(0.07*2 * 3.14 * i / 180))
#         # offset_x = int(i)
#         offset_y = 0
#         if j + offset_x < rows:
#             img_output[i, j] = img[i, (j + offset_x) % cols] - (100 - i / 3) if i / 3 < 100 else img[i, (j + offset_x) % cols]
#         else:
#             img_output[i, j] = 0
#
# # cv2.imshow('Input', img)
# cv2.imwrite('Vertical_wave.png', img_output)
#
# # #####################
# # # Horizontal wave
# #
# img_output_2 = np.zeros(img.shape, dtype=img.dtype)
#
# for i in range(rows):
#     for j in range(cols):
#         offset_x = 0
#         offset_y = int(160.0 * math.atan(0.07*2 * 3.14 * j / 150))
#         if i + offset_y < rows:
#             img_output_2[i, j] = img_output[(i + offset_y) % rows, j] - (100 - j / 3) if j / 3 < 100 else img_output[(i + offset_y) % rows, j]
#         else:
#             img_output_2[i, j] = 0
#
# cv2.imwrite('Horizontal_wave.png', img_output_2)
#
# cv2.imshow('Horizontal wave', img_output)
#
# #####################
# Both horizontal and vertical

img_output = np.zeros(img.shape, dtype=img.dtype)

for i in range(rows):
    for j in range(cols):
        offset_x = int(115.0 * math.atan(0.11*2 * 3.14 * i / 180))
        offset_y = int(140.0 * math.atan(0.11*2 * 3.14 * j / 150))
        if i + offset_y < rows and j + offset_x < cols:
            img_output[i, j] = img[(i + offset_y) % rows, (j + offset_x) % cols] - (100 - i / 4 - j / 2 ) if 100 > (i / 4 + j / 2 ) else img[(i + offset_y) % rows, (j + offset_x) % cols]
        else:
            img_output[i, j] = 0

cv2.imwrite('Multidirectional_wave.png', img_output)
#
# #####################
# # Concave effect
#
# img_output = np.zeros(img.shape, dtype=img.dtype)
#
# for i in range(rows):
#     for j in range(cols):
#         offset_x = int(128.0 * math.sin(2 * 3.14 * i / (2 * cols)))
#         offset_y = 0
#         if j + offset_x < cols:
#             img_output[i, j] = img[i, (j + offset_x) % cols]
#         else:
#             img_output[i, j] = 0
#
# cv2.imshow('Concave', img_output)
#
# cv2.waitKey()