# Validation · 2026-11-02 / Asia-Taipei

## Numerical tests

`npm test`: 12/12 passed, Node.js 24.18.0. Includes channel/alpha, known YUV values, all histogram channel totals, text/JSON parser, invalid kernels, zero/tiny normalization sum, identity, asymmetric convolution direction, normalized constant image, small image borders, saturation and bias, known PSNR.

Initial run: 11/12; empty string was parsed as Number('')=0. Fixed with explicit empty input rejection; rerun: 12/12. This is a real observed regression and fix.

## Browser tests

Chrome, localhost HTTP preview, bundled model, CPU backend.

| Case | Parameters | Observed |
|---|---|---|
| Load generated PNG | 960×540 | correct image and metadata, 49.9 KB in test browser |
| Gaussian | [1,2,1;2,4,2;1,2,1]/16, reflect101 | PSNR 34.444 dB, MSE 23.3688, 157.5 ms (single run) |
| Face default | group.jpg 1366×768, input416, threshold0.50 | 3 detections; 3039.5 ms; scores .7950/.5687/.5444 |
| Face permissive | input608, threshold0.30 | 6 detections; 5300.5 ms; four real faces + two false positives on visual review |
| Face tuned | input608, threshold0.70 | 4 detections; 7072.6 ms; .8842/.7831/.7623/.7060 |

Timing includes first inference warmup variability and UI/worker overhead where indicated; not a benchmark. Face inference timing excludes model loading. Do not generalize the four-face result to arbitrary images.

Additional tests are appended as completed. Screenshots are captured from the live browser, not fabricated interface illustrations.

## Additional completed checks

- Browser-native `verify.html`: 7/7 PASS. Actual PNG/JPG/BMP fixtures decode to 64×48 and RGB 64/128/192; alpha PNG retains 90; 2000×1000 scaling computes 1600×800; damaged PNG is rejected; seven display modes preserve histogram totals (3072 pixels).
- GUI zero-sum kernel + normalization: explicit error shown, no division by zero.
- GUI identity preset: MSE 0.0000, PSNR infinity.
- No-face color chart, input320 / threshold0.70: 0 detections, 2417.8 ms.
- Public Sites deployment succeeded; access set to Public; live page opens in separate in-app browser without a login page.
- Native file picker automation was blocked by extension file URL access settings. This is recorded as a verification limitation, not reported as an end-to-end upload pass.

## GitHub final verification

Public source: https://github.com/ShanksAce/pixel-lab
Numerical verification workflow: success (run 41409049740).
GitHub Pages deployment workflow: success (run 41409049792).
GitHub Pages: https://shanksace.github.io/pixel-lab/

## Final rubric audit

Re-read the assignment's core requirements, submission rules and rubric. Found and fixed a malformed R option opening tag and comma-separated missing weights. Final Node tests: 17/17 (15 numerical + 2 interface). Browser verifier adds real workbench option enumeration and six-channel Canvas pixel checks.

Live observations: native file chooser loaded rgb.bmp (64x48, 9.1KB); normalized5x5 box filter MSE94.6871/PSNR28.368dB; identity MSE0/PSNRInfinity; non-square and zero-sum normalization blocked. Input608/threshold.70 produced 4 face boxes, scores88.42/78.32/76.24/70.61 percent.

PDF includes full original prompts, output/refinement mapping, six-channel screenshots and requirements/rubric correspondence. Exact AI deployment subversion is unavailable; GPT-6 family is known. No invented version or student debugging prompts are included.

Final browser verifier observed 9/9 PASS on public GitHub Pages. Its initial8/9 failure was an initialization race in the verifier; waiting for image metadata resolved it. Six modes were also selected individually via the actual visible UI.


## Final continuation review / 2026-11-07

- Node: 19/19 PASS (15 numerical, 2 interface, 2 production-loader controlled-completion tests).
- Browser: 15/15 PASS, including the real workbench's last-selection race, stale filter edit and real Worker response discard, actual PNG/JPG/BMP File input event handlers.
- Two face-state/JSON tests use an explicitly labelled model double; these verify state/provenance, not detector accuracy. A separate fresh-page real Tiny Face Detector run on group.jpg at608/.70 returned4 faces with scores88.42%,78.31%,76.23%,70.60%, inference4881.4ms.
- The browser download-event automation timed out when testing the real JSON download. The authored browser test verifies generated JSON payload and trigger handling; end-to-end OS download observation is not claimed as passed.
- Existing numerical algorithms and model weights were not changed. No new runtime dependencies.
- Report's source-file table, model metadata, reviewer attribution and screenshot crops were corrected. User-requested redactions remain removed from the PDF. Historical counts above describe earlier runs; this section is the latest result.

Follow-up: user confirmed the download reached Desktop. Inspected the actual pixel-lab-detections.json: threshold0.7/inputSize608/count4/faces.length4, dimensions1366x768, matching the real inference. The download-event observer timed out, but the end-to-end file download itself is now verified. Saved the built-in sample export in docs/final-audit/real-detections.json.


Post-publication check found mixed browser cache versions on GitHub Pages: new verifier with old app assets. Added an app module release query and a verifier iframe release query so published verification cannot silently exercise a cached previous workbench.

