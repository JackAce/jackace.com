require 'rake'

task :build do
    #sh 'cp _data/roulette-systems* json/'
    sh 'rm json/*'
    sh 'jq -c \'.\' _data/roulette-systems-2019.json > json/roulette-systems-2019.json'
    sh 'jq -c \'.\' _data/roulette-systems-2020.json > json/roulette-systems-2020.json'
    sh 'jq -c \'.\' _data/roulette-systems-2021.json > json/roulette-systems-2021.json'
    sh 'jq -c \'.\' _data/roulette-systems-2022.json > json/roulette-systems-2022.json'
    sh 'jq -c \'.\' _data/roulette-systems-2023.json > json/roulette-systems-2023.json'
    sh 'jq -c \'.\' _data/roulette-systems-2024.json > json/roulette-systems-2024.json'
    sh 'jq -c \'.\' _data/roulette-systems-2025.json > json/roulette-systems-2025.json'

    #sh 'jq -s \'add\' _data/roulette-systems-2019.json _data/roulette-systems-2020.json _data/roulette-systems-2021.json _data/roulette-systems-2022.json _data/roulette-systems-2023.json _data/roulette-systems-2024.json > json/roulette-systems-combined.json'

    sh 'touch gambling/roulette/systems/index-static.html'
    sh 'touch gambling/roulette/systems/error-check.html'
    #sh 'bundle exec jekyll serve'
end
