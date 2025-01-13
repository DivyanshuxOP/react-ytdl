import os
import tempfile
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import yt_dlp
import time
import subprocess

app = Flask(__name__)
CORS(app)

@app.route('/api/video-info', methods=['GET'])
def video_info():
    video_url = request.args.get('url')
    if not video_url:
        return jsonify({'error': 'Missing URL parameter'}), 400

    try:
        with yt_dlp.YoutubeDL({'quiet': True}) as ydl:
            info = ydl.extract_info(video_url, download=False)
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
        return {'error': 'Missing parameters'}, 400
    
    print(f"Received itag: {itag}")  # Debugging statement

    try:
        output_video_path = os.path.join(tempfile.gettempdir(), 'output.mkv')
        ydl_opts = {
            'format': f'{itag}+bestaudio/best',  # Combine video and audio streams natively
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
        print(f"Error: {e}")
        return {'error': 'Failed to process download request'}, 500
    
    
    
if __name__ == '__main__':
    app.run(debug=True)