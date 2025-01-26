import os
import tempfile
from flask import Flask, request, jsonify, send_file, send_from_directory
from flask_cors import CORS
import yt_dlp


app = Flask(__name__, static_folder=os.path.join("..", "front", "dist"))
CORS(app)


# Define paths
current_dir = os.getcwd()
cookies_file_path = os.path.join(current_dir, "cookies.txt")

frontend_folder = os.path.join(current_dir, "..", "front")
dist_folder = os.path.join(frontend_folder, "dist")

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_frontend(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')



@app.route('/api/video-info', methods=['GET'])
def video_info():
    video_url = request.args.get('url')
    if not video_url:
        return jsonify({'error': 'Missing URL parameter'}), 400

    try:
        print(f"Fetching video info for: {video_url}")  # Debugging statement
        ydl_opts = {
            'quiet': True,
             # Use the correct cookies file path
        }

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(video_url, download=False)
            
            if 'formats' not in info:
                return jsonify({'error': 'No formats available for this video'}), 400
            
            unique_formats = {}
            for f in info['formats']:
                resolution = f"{f.get('height', 'audio only')}p"
                ext = f['ext']
                if resolution not in unique_formats:
                    unique_formats[resolution] = {
                        'itag': f['format_id'],
                        'resolution': resolution,
                        'quality': f.get('format_note', 'unknown'),
                        'filesize': f.get('filesize', 'N/A'),
                        'ext': ext,
                    }
            formats = list(unique_formats.values())
            
            return jsonify({
                'title': info['title'],
                'thumbnail': info['thumbnail'],
                'duration': info['duration'],
                'formats': formats,
            })
    except Exception as e:
        print(f"Error fetching video info: {str(e)}")  # Print error for debugging
        return jsonify({'error': str(e)}), 500


@app.route('/api/download', methods=['GET'])
def download():
    file_name = "output.mkv"
    tmp_dir = tempfile.gettempdir()
    file_path = os.path.join(tmp_dir, file_name)
    if os.path.exists(file_path):
        os.remove(file_path)

    video_url = request.args.get('url')
    itag = request.args.get('format')
    
    if not video_url or not itag:
        return jsonify({'error': 'Missing parameters'}), 400
    
    print(f"Received video URL: {video_url}")
    print(f"Received itag: {itag}")
    
    try:
        output_video_path = os.path.join(tempfile.gettempdir(), 'output.mkv')
        ydl_opts = {
            'format': f'{itag}+bestaudio/best',  # Combine video and audio streams
            'outtmpl': output_video_path,
            'n_threads': 5,
         
           
        }
    
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([video_url])
    
        final_file_name = "output.webm"
        final_file_path = os.path.join(tempfile.gettempdir(), final_file_name)
    
        if os.path.exists(final_file_path):
            os.remove(final_file_path)
    
        os.rename(output_video_path, final_file_path)
    
        return send_file(final_file_path, as_attachment=True)
    
    except Exception as e:
        print(f"Error during download: {str(e)}")  # Print error for debugging
        return jsonify({'error': 'Failed to process download request'}), 500
    
if __name__ == '__main__':
        app.run(debug=True)
