import h5py
import os
import matplotlib.pyplot as plt
import numpy as np

sample_path = os.path.join('..', 'input', 'food_c101_n10099_r64x64x3.h5')
file_exists = os.path.exists(sample_path)

if file_exists:
    with h5py.File(sample_path, 'r') as n_file:
        print('Data Size:', n_file['images'].shape)
        im_label = n_file['category'].value
        label_names = [x.decode() for x in n_file['category_names'].value]
        fig, (ax1) = plt.subplots(1, 1, figsize=(4, 14))
        v_sum = np.sum(im_label, 0)
        x_coord = np.arange(im_label.shape[1])
        ax1.barh(x_coord, v_sum)
        out_ticks = [(c_x, c_label) for c_sum, c_x, c_label in zip(v_sum, x_coord, label_names) if c_sum > 0]
        ax1.set_yticks([c_x for c_x, c_label in out_ticks])
        _ = ax1.set_yticklabels([c_label for c_x, c_label in out_ticks], rotation=0, fontsize=8)
        ax1.set_ylim(0, x_coord.max())
else:
    print(f"Error: The file '{sample_path}' does not exist. Please check the file path and ensure the file is present.")
    print(f"Current working directory: {os.getcwd()}")